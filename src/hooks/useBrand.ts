import { brandService, BrandRequest } from '@/services/brand.service';

export const useBrand = () => {
  const getBrands = async (page = 0, size = 50) => {
    return await brandService.getBrands(page, size);
  };

  const createBrand = async (request: BrandRequest) => {
    return await brandService.createBrand(request);
  };

  const updateBrand = async (id: string, request: Partial<BrandRequest>) => {
    return await brandService.updateBrand(id, request);
  };

  const deleteBrand = async (id: string) => {
    return await brandService.deleteBrand(id);
  };

  return {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand
  };
};

export default useBrand;
