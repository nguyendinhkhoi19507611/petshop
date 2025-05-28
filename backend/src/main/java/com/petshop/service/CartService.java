package com.petshop.service;

import com.petshop.dto.*;
import com.petshop.entity.*;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PromotionService promotionService;

    // Lấy giỏ hàng của user
    public ApiResponse<CartDTO> getCart(Long userId) {
        try {
            Cart cart = getOrCreateCart(userId);
            CartDTO cartDTO = convertToDTO(cart);
            return ApiResponse.success("Lấy giỏ hàng thành công", cartDTO);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy giỏ hàng: " + e.getMessage());
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    public ApiResponse<CartDTO> addToCart(Long userId, AddToCartRequest request) {
        try {
            // Kiểm tra sản phẩm có tồn tại và còn hàng không
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + request.getProductId()));

            if (!product.getStatus()) {
                return ApiResponse.error("Sản phẩm đã ngừng kinh doanh");
            }

            if (product.getStock() < request.getQuantity()) {
                return ApiResponse.error("Số lượng sản phẩm trong kho không đủ. Còn lại: " + product.getStock());
            }

            Cart cart = getOrCreateCart(userId);

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId());

            if (existingItem.isPresent()) {
                // Cập nhật số lượng
                CartItem cartItem = existingItem.get();
                int newQuantity = cartItem.getQuantity() + request.getQuantity();

                if (product.getStock() < newQuantity) {
                    return ApiResponse.error("Tổng số lượng vượt quá tồn kho. Còn lại: " + product.getStock());
                }

                cartItem.setQuantity(newQuantity);
                cartItem.updatePrices(); // Cập nhật giá mới nhất
                cartItemRepository.save(cartItem);
            } else {
                // Thêm item mới
                CartItem cartItem = new CartItem(cart, product, request.getQuantity());
                cartItemRepository.save(cartItem);
            }

            // Cập nhật tổng giỏ hàng
            updateCartTotals(cart);

            CartDTO cartDTO = convertToDTO(cart);
            return ApiResponse.success("Thêm sản phẩm vào giỏ hàng thành công", cartDTO);

        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thêm sản phẩm vào giỏ hàng: " + e.getMessage());
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public ApiResponse<CartDTO> updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        try {
            CartItem cartItem = cartItemRepository.findById(itemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

            // Kiểm tra quyền sở hữu
            if (!cartItem.getCart().getUser().getId().equals(userId)) {
                return ApiResponse.error("Bạn không có quyền chỉnh sửa sản phẩm này");
            }

            // Kiểm tra tồn kho
            Product product = cartItem.getProduct();
            if (product.getStock() < request.getQuantity()) {
                return ApiResponse.error("Số lượng sản phẩm trong kho không đủ. Còn lại: " + product.getStock());
            }

            cartItem.setQuantity(request.getQuantity());
            cartItem.updatePrices(); // Cập nhật giá mới nhất
            cartItemRepository.save(cartItem);

            // Cập nhật tổng giỏ hàng
            Cart cart = cartItem.getCart();
            updateCartTotals(cart);

            CartDTO cartDTO = convertToDTO(cart);
            return ApiResponse.success("Cập nhật số lượng thành công", cartDTO);

        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật số lượng: " + e.getMessage());
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public ApiResponse<CartDTO> removeFromCart(Long userId, Long itemId) {
        try {
            CartItem cartItem = cartItemRepository.findById(itemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

            // Kiểm tra quyền sở hữu
            if (!cartItem.getCart().getUser().getId().equals(userId)) {
                return ApiResponse.error("Bạn không có quyền xóa sản phẩm này");
            }

            Cart cart = cartItem.getCart();
            cartItemRepository.delete(cartItem);

            // Cập nhật tổng giỏ hàng
            updateCartTotals(cart);

            CartDTO cartDTO = convertToDTO(cart);
            return ApiResponse.success("Xóa sản phẩm khỏi giỏ hàng thành công", cartDTO);

        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + e.getMessage());
        }
    }

    // Xóa toàn bộ giỏ hàng
    public ApiResponse<Void> clearCart(Long userId) {
        try {
            Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
            if (cartOpt.isPresent()) {
                Cart cart = cartOpt.get();
                cartItemRepository.deleteAllByCartId(cart.getId());

                cart.setTotalPrice(BigDecimal.ZERO);
                cart.setTotalQuantity(0);
                cart.setDiscount(BigDecimal.ZERO);
                cart.setCouponCode(null);
                cart.setLastUpdated(LocalDateTime.now());
                cartRepository.save(cart);
            }

            return ApiResponse.success("Xóa toàn bộ giỏ hàng thành công");
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa giỏ hàng: " + e.getMessage());
        }
    }

    // Lấy tóm tắt giỏ hàng
    public ApiResponse<CartSummaryDTO> getCartSummary(Long userId) {
        try {
            Cart cart = getOrCreateCart(userId);
            CartSummaryDTO summary = new CartSummaryDTO();

            summary.setTotalItems(cart.getTotalQuantity());
            summary.setSubtotal(cart.getTotalPrice());
            summary.setDiscount(cart.getDiscount());
            summary.setCouponCode(cart.getCouponCode());

            // Tính phí vận chuyển (có thể customize theo logic riêng)
            BigDecimal shipping = calculateShippingFee(cart.getTotalPrice());
            summary.setShipping(shipping);

            BigDecimal total = cart.getTotalPrice().subtract(cart.getDiscount()).add(shipping);
            summary.setTotal(total);

            // Kiểm tra có sản phẩm hết hàng không
            boolean hasOutOfStockItems = cart.getCartItems().stream()
                    .anyMatch(item -> item.getProduct().getStock() < item.getQuantity());
            summary.setHasOutOfStockItems(hasOutOfStockItems);

            return ApiResponse.success("Lấy tóm tắt giỏ hàng thành công", summary);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy tóm tắt giỏ hàng: " + e.getMessage());
        }
    }

    // Áp dụng mã giảm giá
    public ApiResponse<CartDTO> applyCoupon(Long userId, ApplyCouponRequest request) {
        try {
            Cart cart = getOrCreateCart(userId);

            // Validate coupon
            ValidateCouponRequest validateRequest = new ValidateCouponRequest();
            validateRequest.setCouponCode(request.getCouponCode());
            validateRequest.setOrderAmount(cart.getTotalPrice());
            validateRequest.setUserId(userId);

            ApiResponse<ValidateCouponResponse> validationResult = promotionService.validateCoupon(validateRequest);

            if (!validationResult.isSuccess() || !validationResult.getData().isValid()) {
                return ApiResponse.error(validationResult.getData() != null ?
                        validationResult.getData().getMessage() : "Mã giảm giá không hợp lệ");
            }

            // Áp dụng mã giảm giá
            ValidateCouponResponse couponData = validationResult.getData();
            cart.setCouponCode(request.getCouponCode());
            cart.setDiscount(couponData.getDiscountAmount());
            cart.setLastUpdated(LocalDateTime.now());
            cartRepository.save(cart);

            CartDTO cartDTO = convertToDTO(cart);
            return ApiResponse.success("Áp dụng mã giảm giá thành công", cartDTO);

        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi áp dụng mã giảm giá: " + e.getMessage());
        }
    }

    // Helper methods

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    private void updateCartTotals(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartIdOrderByAddedAtDesc(cart.getId());
        cart.setCartItems(items);
        cart.updateTotals();
        cartRepository.save(cart);
    }

    private BigDecimal calculateShippingFee(BigDecimal subtotal) {
        // Logic tính phí vận chuyển
        if (subtotal.compareTo(BigDecimal.valueOf(500000)) >= 0) {
            return BigDecimal.ZERO; // Free shipping cho đơn >= 500k
        }
        return BigDecimal.valueOf(30000); // Phí ship cố định 30k
    }

    // Convert methods

    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setTotalQuantity(cart.getTotalQuantity());
        dto.setDiscount(cart.getDiscount());
        dto.setCouponCode(cart.getCouponCode());
        dto.setLastUpdated(cart.getLastUpdated());

        if (cart.getCartItems() != null) {
            List<CartItemDTO> itemDTOs = cart.getCartItems().stream()
                    .map(this::convertItemToDTO)
                    .collect(Collectors.toList());
            dto.setCartItems(itemDTOs);
        }

        return dto;
    }

    private CartItemDTO convertItemToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setCartId(item.getCart().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getProductName());
        dto.setProductImage(item.getProduct().getImage());
        dto.setSku(item.getProduct().getSku());
        dto.setQuantity(item.getQuantity());
        dto.setPriceAtTime(item.getPriceAtTime());
        dto.setSalePriceAtTime(item.getSalePriceAtTime());
        dto.setSubtotal(item.getSubtotal());
        dto.setAvailableStock(item.getProduct().getStock());
        dto.setAddedAt(item.getAddedAt());
        return dto;
    }
}