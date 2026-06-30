import apiClient from './api-client';
import { Cart, CartItem } from '@/types/cart';

const LOCAL_CART_KEY = 'novatech_guest_cart';

const getGuestCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Lỗi khi đọc giỏ hàng guest:', error);
    return [];
  }
};

const saveGuestCartItems = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Lỗi khi lưu giỏ hàng guest:', error);
  }
};

export const cartService = {
  // Trợ giúp lấy headers
  getHeaders(userId?: string) {
    const headers: Record<string, string> = {};
    if (userId) {
      headers['User-Id'] = userId;
    } else if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('novatech_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.id) {
            headers['User-Id'] = user.id;
          }
        }
      } catch {
        // Ignored
      }
    }
    return headers;
  },

  async getCart(userId?: string): Promise<Cart> {
    const headers = this.getHeaders(userId);
    if (!headers['User-Id']) {
      // Guest cart
      return {
        id: 'guest',
        userId: 'guest',
        items: getGuestCartItems()
      };
    }

    try {
      const response = await apiClient.get<Cart>('/carts/my-cart', { headers });
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi lấy giỏ hàng từ server, chuyển sang guest cart:', error);
      return {
        id: 'guest',
        userId: 'guest',
        items: getGuestCartItems()
      };
    }
  },

  async addToCart(productVariantId: string, quantity: number, userId?: string): Promise<Cart> {
    const headers = this.getHeaders(userId);
    if (!headers['User-Id']) {
      // Guest
      const items = getGuestCartItems();
      const existing = items.find(item => item.productVariantId === productVariantId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({
          id: productVariantId, // Tạm thời dùng variantId làm itemId cho guest
          productVariantId,
          variantName: 'Sản phẩm',
          price: 0, // Sẽ lấy giá trị thật từ sản phẩm lúc render
          quantity
        });
      }
      saveGuestCartItems(items);
      return { id: 'guest', userId: 'guest', items };
    }

    const response = await apiClient.post<Cart>('/carts/items', { productVariantId, quantity }, { headers });
    return response.data;
  },

  async updateCartItem(itemId: string, productVariantId: string, quantity: number, userId?: string): Promise<Cart> {
    const headers = this.getHeaders(userId);
    if (!headers['User-Id']) {
      // Guest
      const items = getGuestCartItems();
      const existing = items.find(item => item.productVariantId === productVariantId);
      if (existing) {
        existing.quantity = quantity;
      }
      saveGuestCartItems(items);
      return { id: 'guest', userId: 'guest', items };
    }

    const response = await apiClient.put<Cart>(`/carts/items/${itemId}`, { productVariantId, quantity }, { headers });
    return response.data;
  },

  async removeFromCart(itemId: string, productVariantId: string, userId?: string): Promise<Cart> {
    const headers = this.getHeaders(userId);
    if (!headers['User-Id']) {
      // Guest
      let items = getGuestCartItems();
      items = items.filter(item => item.productVariantId !== productVariantId);
      saveGuestCartItems(items);
      return { id: 'guest', userId: 'guest', items };
    }

    await apiClient.delete(`/carts/items/${itemId}`, { headers });
    return this.getCart(userId);
  },

  async clearCart(userId?: string): Promise<void> {
    const headers = this.getHeaders(userId);
    if (!headers['User-Id']) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_CART_KEY);
      }
      return;
    }
    await apiClient.delete('/carts/clear', { headers });
  }
};

export default cartService;
