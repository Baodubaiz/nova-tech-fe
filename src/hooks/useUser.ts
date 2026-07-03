import { userService, UserUpdateRequest } from '@/services/user.service';

export const useUser = () => {
  const updateUser = async (id: string, request: UserUpdateRequest) => {
    return await userService.updateUser(id, request);
  };

  const getUserById = async (id: string) => {
    return await userService.getUserById(id);
  };

  const getAllUsers = async (page = 0, size = 10) => {
    return await userService.getAllUsers(page, size);
  };

  const deleteUser = async (id: string) => {
    return await userService.deleteUser(id);
  };

  return {
    updateUser,
    getUserById,
    getAllUsers,
    deleteUser
  };
};

export default useUser;
