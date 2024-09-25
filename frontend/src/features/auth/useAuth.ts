import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  verifyToken,
  loginUser,
  registerUser,
  registerTemporaryUser,
} from "./authAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { AuthData } from "./authTypes";
import { auth } from "../../firebaseConfig";

const tempUserData = localStorage.getItem("tempUserData");

export const useAuth = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const [tempUser, setTempUser] = useState<AuthData | null>(
    tempUserData ? JSON.parse(tempUserData) : null
  );
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthEnabled, setIsAuthEnabled] = useState(enabled);

  const _clearAuthData = useCallback(() => {
    setIsAuthEnabled(false);
    localStorage.removeItem("authToken");
    queryClient.setQueryData(["auth"], null);
    auth.signOut();
  }, [queryClient]);

  const logout = () => {
    _clearAuthData();

    navigate("/auth");
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
      if (location.pathname !== "/auth") {
        navigate("/auth");
      }
    }
  }, [isError, error, location.pathname, navigate]);

  // Freed up app to non-users
  // useEffect(() => {
  //   if (isSuccess && isAuthEnabled && data) {
  //     if (!data.authenticated) {
  //       console.log("User is not authenticated, clearing auth data");
  //       _clearAuthData();
  //       if (location.pathname !== "/") {
  //         // navigate("/");
  //       }
  //     }
  //   }
  // }, [
  //   isSuccess,
  //   isAuthEnabled,
  //   data,
  //   location.pathname,
  //   _clearAuthData,
  //   navigate,
  // ]);

  const user = data?.authenticated ? data : tempUser ? tempUser : null;

  console.log("user", user);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthData) => {
      queryClient.setQueryData(["auth"], data);
      setIsAuthEnabled(true);
      refetch();
      navigate("/");
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
      navigate("/");
    },
    onError: (error: Error) => {
      setIsAuthEnabled(false);
      throw error;
    },
  });

  const registerTemporaryUserMutation = useMutation({
    mutationFn: registerTemporaryUser,
    onSuccess: (data: AuthData) => {
      queryClient.setQueryData(["auth"], data);
      localStorage.setItem("tempUserData", JSON.stringify(data));
      setTempUser(data);
      return data;
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
    logout,
  };
};
