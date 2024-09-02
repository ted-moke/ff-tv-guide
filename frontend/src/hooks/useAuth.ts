import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { verifyToken, loginUser, registerUser } from '../api/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['auth'],
    queryFn: verifyToken,
    retry: false,
    onError: () => {
      navigate('/login');
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
      navigate('/');
    },
  });

  const logout = () => {
    // Implement logout functionality here
    queryClient.setQueryData(['auth'], null);
    navigate('/login');
  };

  return { 
    user, 
    isLoading, 
    isError, 
    login: loginMutation.mutate, 
    register: registerMutation.mutate,
    logout 
  };
};