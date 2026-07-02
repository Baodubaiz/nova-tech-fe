import { categoryService, CategoryRequest } from '@/services/category.service';

export const useCategory = () => {
  const getCategories = async (page = 0, size = 20) => {
    return await categoryService.getCategories(page, size);
  };

  const createCategory = async (request: CategoryRequest) => {
    return await categoryService.createCategory(request);
  };

  const updateCategory = async (id: string, request: Partial<CategoryRequest>) => {
    return await categoryService.updateCategory(id, request);
  };

  const deleteCategory = async (id: string) => {
    return await categoryService.deleteCategory(id);
  };

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};

export default useCategory;
