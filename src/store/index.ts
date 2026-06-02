import { create } from 'zustand';
import type { User, UserRole } from '@/types';

interface AppState {
  // Current user
  currentUser: User;
  setUser: (user: User) => void;
  setRole: (role: UserRole) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: {
    id: 'u-leo',
    name: 'Leo (管理员)',
    role: 'admin',
    stores: [],
    asins: [],
  },
  setUser: (user) => set({ currentUser: user }),
  setRole: (role) =>
    set((s) => ({ currentUser: { ...s.currentUser, role } })),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  globalSearch: '',
  setGlobalSearch: (q) => set({ globalSearch: q }),
}));
