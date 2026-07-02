export interface CartItem {
  id: string;
  productVariantId: string;
  variantName: string;
  price: number;
  quantity: number;
  // Local UI extensions
  productId?: string;
  productName?: string;
  imageUrl?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}
