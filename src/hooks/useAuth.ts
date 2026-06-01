import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes.config';

export const useAuth = () => {
  const router = useRouter();
  const { 
    user, 
    accessToken, 
    isAuthenticated, 
    isLoading, 
    setAuth, 
    clearAuth, 
    setLoading 
  } = useAuthStore();

  const login = async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      if (data.user && data.accessToken) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        
        // Redirect based on role
        const role = typeof data.user.role === 'string' 
          ? data.user.role 
          : (data.user.role?.roleName || data.user.role?.name || 'USER');
          
        if (role === 'ADMIN') {
          router.push(routes.adminDashboard);
        } else {
          router.push(routes.userDashboard || routes.home);
        }
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterRequest) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      if (data.user && data.accessToken) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        
        // Redirect based on role
        const role = typeof data.user.role === 'string' 
          ? data.user.role 
          : (data.user.role?.roleName || data.user.role?.name || 'USER');
          
        if (role === 'ADMIN') {
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.push(routes.adminDashboard);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.push(routes.home);
        }
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setLoading(false);
      router.push(routes.login);
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};

export default useAuth;
