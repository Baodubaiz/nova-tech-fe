import { cartService } from '@/services/cart.service';

export const useCart = () => {
  const getCart = async (userId?: string) => {
    return await cartService.getCart(userId);
  };

  const addToCart = async (productVariantId: string, quantity: number, userId?: string) => {
    return await cartService.addToCart(productVariantId, quantity, userId);
  };

  const updateCartItem = async (itemId: string, productVariantId: string, quantity: number, userId?: string) => {
    return await cartService.updateCartItem(itemId, productVariantId, quantity, userId);
  };

  const removeFromCart = async (itemId: string, productVariantId: string, userId?: string) => {
    return await cartService.removeFromCart(itemId, productVariantId, userId);
  };

  const clearCart = async (userId?: string) => {
    return await cartService.clearCart(userId);
  };

  return {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
};

export default useCart;
