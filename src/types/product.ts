export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export interface ProductImage {
  id: string;
  variantId: string;
  url: string;
  isThumbnail: boolean;
  createdAt?: string;
}

export interface VariantSpec {
  id: string;
  variantId: string;
  specKey: {
    id: string;
    name: string;
    unit?: string;
    dataType: string;
  };
  value: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  skuVariant: string;
  variantName: string;
  price: number;
  discountPrice?: number;
  stock: number;
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  isActive: boolean;
  images: ProductImage[];
  specs?: VariantSpec[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  brand?: Brand;
  category?: Category;
  variants: ProductVariant[];
  images?: ProductImage[];
  isActive: boolean;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
