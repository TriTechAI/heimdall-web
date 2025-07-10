'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, type User, type LoginRequest, type LoginResponse } from '@/services/api/auth.service';
import { message } from 'antd';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Get user profile query
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authService.getProfile(),
    enabled: isInitialized && authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: LoginResponse) => {
      queryClient.setQueryData(['auth', 'profile'], data.user);
      message.success('Login successful');
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      message.success('Logged out successfully');
      // Redirect to login page
      window.location.href = '/login';
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
      // Still redirect even if logout API fails
      queryClient.clear();
      window.location.href = '/login';
    },
  });

  // Initialize auth state on mount
  useEffect(() => {
    // Check if user is already authenticated
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      queryClient.setQueryData(['auth', 'profile'], storedUser);
    }
    setIsInitialized(true);
  }, [queryClient]);

  const contextValue: AuthContextType = {
    user: user || null,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    isAuthenticated: !!user && authService.isAuthenticated(),
    login: loginMutation.mutateAsync,
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    refetch,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}