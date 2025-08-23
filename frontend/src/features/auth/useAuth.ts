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
import { auth, app, getAuth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";

export const useAuth = ({ enabled = false }: { enabled?: boolean } = {}) => {
  // const [tempUser, setTempUser] = useState<AuthData | null>(
  //   localStorage.getItem("tempUserData")
  //     ? JSON.parse(localStorage.getItem("tempUserData")!)
  //     : null
  // );
  const [user, setUser] = useState<User | null>(null);
  const [isAuthEnabled, setIsAuthEnabled] = useState(enabled);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
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
    // Check if there's an existing token and try to verify it immediately
    // const existingToken = localStorage.getItem("authToken");
    // if (existingToken) {
    //   console.log("Found existing token, enabling auth verification");
    //   setIsAuthEnabled(true);
    // } else {
    //   console.log('No existing token');
    //   setIsInitializing(false);
    // }
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      console.log("auth state changed");
      console.log("user", user);
      setUser(user);
      setIsAuthEnabled(true);
      setIsInitializing(false);
    });
    
    // Set a timeout to mark initialization as complete even if no user is found
    // This prevents the app from being stuck in loading state
    // const timeout = setTimeout(() => {
    //   console.log("auth timed out")
    //   setIsInitializing(false);
    // }, 4000);
    
    // return () => clearTimeout(timeout);
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

  // const user = isInitializing ? null : !tokenVerified ? null : data?.authenticated ? data : tempUser ? tempUser : null;

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthData) => {
      // queryClient.setQueryData(["auth"], data);
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
      // queryClient.setQueryData(["auth"], data);
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
      // setTempUser(data);
      // localStorage.setItem("tempUserData", JSON.stringify(data));
      // queryClient.setQueryData(["auth"], data);
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
      // setTempUser(null);
      // localStorage.removeItem("tempUserData");
      // queryClient.setQueryData(["auth"], data);
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
    isLoading: isLoading || isInitializing,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    registerTemporaryUser: registerTemporaryUserMutation.mutateAsync,
    convertTempUser: convertTempUserMutation.mutateAsync,
    logout,
  };
};
