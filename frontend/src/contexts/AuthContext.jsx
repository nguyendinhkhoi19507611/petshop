import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import { STORAGE_KEYS, MESSAGES } from '../utils/constants';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AuthActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER: 'LOAD_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
    case AuthActionTypes.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.LOGIN_FAILURE:
    case AuthActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AuthActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        isLoading: false,
      };

    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({
            type: AuthActionTypes.LOAD_USER,
            payload: { user, token },
          });
        } else {
          dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AuthActionTypes.LOGIN_START });

      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { accessToken, username, roles, id, email, fullName } = response.data;
        
        const userData = {
          id,
          username,
          email,
          fullName,
          roles,
          role: roles[0]?.replace('ROLE_', '') || 'KHÁCH HÀNG',
        };

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

        dispatch({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload: {
            user: userData,
            token: accessToken,
          },
        });

        return { success: true, message: MESSAGES.SUCCESS.LOGIN };
      } else {
        throw new Error(response.data.message || MESSAGES.ERROR.LOGIN_FAILED);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || MESSAGES.ERROR.LOGIN_FAILED;
      
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: errorMessage,
      });

      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.REGISTER_START });

      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        dispatch({ type: AuthActionTypes.REGISTER_SUCCESS });
        return { success: true, message: response.data.message || 'Đăng ký thành công!' };
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại!';
      
      dispatch({
        type: AuthActionTypes.REGISTER_FAILURE,
        payload: errorMessage,
      });

      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CART);

      dispatch({ type: AuthActionTypes.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // Get current user function
  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      logout();
      return null;
    }
  };

  // Check if user has role
  const hasRole = (role) => {
    if (!state.user || !state.user.roles) return false;
    return state.user.roles.some(userRole => 
      userRole.replace('ROLE_', '').toUpperCase() === role.toUpperCase()
    );
  };

  // Check if user is admin
  const isAdmin = () => hasRole('ADMIN');

  // Check if user is employee
  const isEmployee = () => hasRole('NHÂN VIÊN') || hasRole('EMPLOYEE');

  // Check if user is customer
  const isCustomer = () => hasRole('KHÁCH HÀNG') || hasRole('CUSTOMER');

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    getCurrentUser,
    hasRole,
    isAdmin,
    isEmployee,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;