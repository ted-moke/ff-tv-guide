import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyToken, loginUser, registerUser } from './authAPI';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthData } from './authTypes'

export const useAuth = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthEnabled, setIsAuthEnabled] = useState(true);

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery<AuthData | null, Error, AuthData>({
    queryKey: ['auth'],
    queryFn: verifyToken,
    retry: false,
    enabled: isAuthEnabled,
  });

  useEffect(() => {
    if (isError) {
      console.error('Auth query error:', error);
      setIsAuthEnabled(false);
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    }
  }, [isError, error, location.pathname, navigate]);

  useEffect(() => {
    if (isSuccess && data && !data.authenticated) {
      queryClient.setQueryData(['auth'], null);
      if (location.pathname !== '/auth') {
        navigate('/');
      }
    }
  }, [isSuccess, data, location.pathname, navigate, queryClient]);

  const user = data?.authenticated ? data : null;

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthData) => {
      queryClient.setQueryData(['auth'], data);
      setIsAuthEnabled(true);
      refetch();
      navigate('/');
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false);
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: AuthData) => {
      queryClient.setQueryData(['auth'], data);
      setIsAuthEnabled(true);
      refetch();
      navigate('/');
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false);
      throw error;
    },
  });

  const logout = () => {
    // Implement logout functionality here
    queryClient.setQueryData(['auth'], null);
    setIsAuthEnabled(false);
    navigate('/auth');
  };

  return { 
    user, 
    isLoading, 
    error, 
    login: loginMutation.mutateAsync, 
    register: registerMutation.mutateAsync,
    logout 
  };
};