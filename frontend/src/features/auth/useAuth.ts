import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  verifyToken,
  loginUser,
  registerUser,
  registerTemporaryUser,
  convertTempUser,
  setupAuthStateListener,
} from "./authAPI";
import { useState, useEffect, useCallback } from "react";
import { AuthData } from "./authTypes";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

export const useAuth = ({ enabled = false }: { enabled?: boolean } = {}) => {
  const [tempUser, setTempUser] = useState<AuthData | null>(
    localStorage.getItem("tempUserData")
      ? JSON.parse(localStorage.getItem("tempUserData")!)
      : null
  );
  const [isAuthEnabled, setIsAuthEnabled] = useState(enabled);
  const [tokenVerified, setTokenVerified] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const _clearAuthData = useCallback(async () => {
    setIsAuthEnabled(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("tempUserData");
    await auth.signOut();
    queryClient.setQueryData(["auth"], null);
  }, [queryClient]);

  const logout = async () => {
    await _clearAuthData();
    navigate("/");
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
    setupAuthStateListener((user) => {
      console.log("user", user);
      setIsAuthEnabled(true);
    });
  }, []);

  useEffect(() => {
    if (data && data.authenticated) {
      setTokenVerified(true);
    }
    console.log('data', data);
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.error("Auth query error:", error);
      setIsAuthEnabled(false);
    }
  }, [isError, error, location.pathname]);

  const user = !tokenVerified ? null : data?.authenticated ? data : tempUser ? tempUser : null;

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthData) => {
      queryClient.setQueryData(["auth"], data);
      setIsAuthEnabled(true);
      // Don't call refetch immediately to avoid race condition
      // refetch();
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
      // Don't call refetch immediately to avoid race condition
      // refetch();
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
      // Don't call refetch immediately to avoid race condition
      // refetch();
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
