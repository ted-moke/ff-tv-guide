import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyToken, loginUser, registerUser } from '../api/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthEnabled, setIsAuthEnabled] = useState(location.pathname !== '/auth');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth'],
    queryFn: verifyToken,
    retry: false,
    enabled: isAuthEnabled, // Control query enabling with state
    onError: () => {
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    },
    onSuccess: (data) => {
      if (!data.authenticated) {
        queryClient.setQueryData(['auth'], null);
      } else {
        queryClient.setQueryData(['auth'], data);
      }
    }
  });

  const user = data?.authenticated ? data : null;

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
      setIsAuthEnabled(true); // Re-enable the auth query after successful login
      navigate('/');
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false); // Disable the auth query on login error
      throw error; // Pass the error to the component
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
      setIsAuthEnabled(true); // Re-enable the auth query after successful registration
      navigate('/');
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false); // Disable the auth query on registration error
      throw error; // Pass the error to the component
    },
  });

  const logout = () => {
    // Implement logout functionality here
    queryClient.setQueryData(['auth'], null);
    setIsAuthEnabled(false); // Disable the auth query on logout
    navigate('/auth');
  };

  return { 
    user, 
    isLoading, 
    isError, 
    login: loginMutation.mutateAsync, 
    register: registerMutation.mutateAsync,
    logout 
  };
};