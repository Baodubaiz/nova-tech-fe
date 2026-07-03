import { productService, ProductRequest, ProductVariantRequest } from '@/services/product.service';

export const useProduct = () => {
  const getProducts = async (page = 0, size = 12, keyword?: string) => {
    return await productService.getProducts(page, size, keyword);
  };

  const getProductById = async (id: string) => {
    return await productService.getProductById(id);
  };

  const createProduct = async (request: ProductRequest) => {
    return await productService.createProduct(request);
  };

  const updateProduct = async (id: string, request: Partial<ProductRequest>) => {
    return await productService.updateProduct(id, request);
  };

  const deleteProduct = async (id: string) => {
    return await productService.deleteProduct(id);
  };

  const getVariantsByProduct = async (productId: string, page = 0, size = 50) => {
    return await productService.getVariantsByProduct(productId, page, size);
  };

  const createVariant = async (productId: string, request: ProductVariantRequest) => {
    return await productService.createVariant(productId, request);
  };

  const updateVariant = async (id: string, request: Partial<ProductVariantRequest>) => {
    return await productService.updateVariant(id, request);
  };

  const deleteVariant = async (id: string) => {
    return await productService.deleteVariant(id);
  };

  return {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getVariantsByProduct,
    createVariant,
    updateVariant,
    deleteVariant
  };
};

export default useProduct;
