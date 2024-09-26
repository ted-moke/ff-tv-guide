import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  verifyToken,
  loginUser,
  registerUser,
  registerTemporaryUser,
  convertTempUser,
} from "./authAPI";
import { useState, useEffect, useCallback } from "react";
import { AuthData } from "./authTypes";
import { auth } from "../../firebaseConfig";

export const useAuth = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const [tempUser, setTempUser] = useState<AuthData | null>(
    localStorage.getItem("tempUserData")
      ? JSON.parse(localStorage.getItem("tempUserData")!)
      : null
  );
  const queryClient = useQueryClient();
  const [isAuthEnabled, setIsAuthEnabled] = useState(enabled);

  const _clearAuthData = useCallback(() => {
    setIsAuthEnabled(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("tempUserData");
    queryClient.setQueryData(["auth"], null);
    auth.signOut();
  }, [queryClient]);

  const logout = () => {
    _clearAuthData();
    // Remove navigation logic from here
  };

  const { data, isLoading, isError, error, refetch } = useQuery<
    AuthData | null,
    Error,
    AuthData
  >({
    queryKey: ["auth"],
    queryFn: verifyToken,
    retry: false,
    enabled: isAuthEnabled,
  });

  useEffect(() => {
    if (isError) {
      console.error("Auth query error:", error);
      setIsAuthEnabled(false);
      
    }
  }, [isError, error, location.pathname]);

  const user = data?.authenticated ? data : tempUser ? tempUser : null;

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthData) => {
      queryClient.setQueryData(["auth"], data);
      setIsAuthEnabled(true);
      refetch();
      // Remove navigation logic from here
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false);
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: AuthData) => {
      queryClient.setQueryData(["auth"], data);
      setIsAuthEnabled(true);
      refetch();
      // Remove navigation logic from here
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false);
      throw error;
    },
  });

  const registerTemporaryUserMutation = useMutation({
    mutationFn: registerTemporaryUser,
    onSuccess: (data: AuthData) => {
      setTempUser(data);
      localStorage.setItem("tempUserData", JSON.stringify(data));
      queryClient.setQueryData(["auth"], data);
      return data;
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false);
      throw error;
    },
  });

  const convertTempUserMutation = useMutation({
    mutationFn: (
      userData: { id: string; email: string; username: string; password: string }
    ) => convertTempUser(userData),
    onSuccess: (data: AuthData) => {
      setTempUser(null);
      localStorage.removeItem("tempUserData");
      queryClient.setQueryData(["auth"], data);
      setIsAuthEnabled(true);
      refetch();
      // Remove navigation logic from here
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false);
      throw error;
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    registerTemporaryUser: registerTemporaryUserMutation.mutateAsync,
    convertTempUser: convertTempUserMutation.mutateAsync,
    logout,
  };
};
