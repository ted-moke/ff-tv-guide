import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyToken, loginUser, registerUser } from "./authAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { AuthData } from "./authTypes";
import { auth } from "../../firebaseConfig";

export const useAuth = ({ enabled = true }: { enabled?: boolean } = {}) => {
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

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery<
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

  useEffect(() => {
    if (isSuccess && isAuthEnabled && data) {
      if (!data.authenticated) {
        console.log("User is not authenticated, clearing auth data");
        _clearAuthData();
        if (location.pathname !== "/") {
          navigate("/");
        }
      }
    }
  }, [
    isSuccess,
    isAuthEnabled,
    data,
    location.pathname,
    _clearAuthData,
    navigate,
  ]);

  const user = data?.authenticated ? data : null;

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

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
  };
};
