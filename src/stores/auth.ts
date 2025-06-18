import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthAPI } from '@/service/request';

interface User {
  id: number;
  email: string;
  username?: string;
  name?: string;
}

interface Session {
  user: User | null;
}

interface AuthState {
  // 状态
  session: Session | null;
  permissions: string[];
  loading: boolean;
  permissionsLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  fetchSession: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  logout: () => void;

  // 权限检查方法
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

let isSessionFetching = false;
let isPermissionsFetching = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      session: null,
      permissions: [],
      loading: false,
      permissionsLoading: false,
      error: null,
      isInitialized: false,

      // 初始化认证状态（页面加载时调用）
      initializeAuth: async () => {
        const state = get();
        if (state.isInitialized) return;

        // 如果有持久化的 session，只需要验证并获取最新权限
        if (state.session?.user) {
          set({ isInitialized: true });
          try {
            // 验证 session 有效性并获取最新权限
            await get().fetchPermissions();
          } catch (error) {
            console.error('验证会话失败:', error);
            // 如果验证失败，清空session并重新获取
            await get().fetchSession();
            await get().fetchPermissions();
          }
          return;
        }

        set({ loading: true, isInitialized: true });

        try {
          // 先获取 session，再获取 permissions
          await get().fetchSession();
          await get().fetchPermissions();
        } catch (error) {
          console.error('初始化认证失败:', error);
          set({ error: '初始化失败' });
        } finally {
          set({ loading: false });
        }
      },

      // 获取会话信息
      fetchSession: async () => {
        if (isSessionFetching) return;

        isSessionFetching = true;
        set({ loading: true, error: null });

        try {
          const response = await AuthAPI.getSession();

          if (response.code === 0) {
            set({ session: response.data, error: null });
          } else {
            set({ session: null, error: response.message });
          }
        } catch (error) {
          console.error('获取会话失败:', error);
          set({ session: null, error: '获取会话失败' });
        } finally {
          set({ loading: false });
          isSessionFetching = false;
        }
      },

      // 获取权限信息
      fetchPermissions: async () => {
        if (isPermissionsFetching) return;

        const state = get();

        // 如果没有用户登录，清空权限
        if (!state.session?.user) {
          set({ permissions: [], permissionsLoading: false });
          return;
        }

        isPermissionsFetching = true;
        set({ permissionsLoading: true, error: null });

        try {
          const response = await AuthAPI.getPermissions();

          if (response.code === 0) {
            set({ permissions: response.data || [], error: null });
          } else {
            set({ permissions: [], error: response.message });
          }
        } catch (error) {
          console.error('获取权限失败:', error);
          set({ permissions: [], error: '获取权限失败' });
        } finally {
          set({ permissionsLoading: false });
          isPermissionsFetching = false;
        }
      },

      // 退出登录
      logout: () => {
        set({
          session: null,
          permissions: [],
          loading: false,
          permissionsLoading: false,
          error: null,
          isInitialized: false
        });
        isSessionFetching = false;
        isPermissionsFetching = false;
      },

      // 权限检查方法
      hasPermission: (permission: string) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      hasAnyPermission: (permissions: string[]) => {
        const { permissions: userPermissions } = get();
        return permissions.some((perm) => userPermissions.includes(perm));
      },

      hasAllPermissions: (permissions: string[]) => {
        const { permissions: userPermissions } = get();
        return permissions.every((perm) => userPermissions.includes(perm));
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 只持久化核心数据，避免临时状态
      partialize: (state) => ({
        session: state.session,
        permissions: state.permissions,
        isInitialized: state.isInitialized
      }),
      // 重要：跳过服务端渲染的水合
      skipHydration: true
    }
  )
);
