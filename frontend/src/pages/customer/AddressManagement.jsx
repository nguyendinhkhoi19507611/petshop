import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AddressList } from '../../components/address';

const AddressManagement = () => {
  const { user } = useAuth();

  return (
    <AddressList 
      userId={user?.id} 
      showHeader={true}
      canEdit={true}
    />
  );
};

export default AddressManagement;