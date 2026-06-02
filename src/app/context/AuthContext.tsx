import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, User, UserRole } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'perpus_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('perpus_users');
    return stored ? JSON.parse(stored) : mockUsers;
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { userId } = JSON.parse(stored);
        const allUsers: User[] = JSON.parse(localStorage.getItem('perpus_users') || JSON.stringify(mockUsers));
        const user = allUsers.find(u => u.id === userId);
        if (user) setCurrentUser(user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const allUsers: User[] = JSON.parse(localStorage.getItem('perpus_users') || JSON.stringify(mockUsers));
    const user = allUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      setIsLoading(false);
      return { success: false, message: 'Email atau password salah.' };
    }
    if (user.status === 'inactive') {
      setIsLoading(false);
      return { success: false, message: 'Akun Anda tidak aktif. Hubungi admin.' };
    }

    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: user.id }));
    setIsLoading(false);
    return { success: true, message: 'Login berhasil!' };
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const allUsers: User[] = JSON.parse(localStorage.getItem('perpus_users') || JSON.stringify(mockUsers));
    if (allUsers.find(u => u.email === data.email)) {
      setIsLoading(false);
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      phone: data.phone,
      address: data.address,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    const updated = [...allUsers, newUser];
    localStorage.setItem('perpus_users', JSON.stringify(updated));
    setUsers(updated);
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: newUser.id }));
    setIsLoading(false);
    return { success: true, message: 'Registrasi berhasil!' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!currentUser) return false;
    if (Array.isArray(role)) return role.includes(currentUser.role);
    return currentUser.role === role;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!currentUser,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
