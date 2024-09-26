import React, { useState, useEffect } from "react";
import { useAuthContext } from "../features/auth/AuthProvider";

import { useSearchParams, useNavigate } from "react-router-dom";
import FFTVGLogo from "../assets/FFTVGLogo";
import RegisterForm from "../components/forms/RegisterForm";
import LoginForm from "../components/forms/LoginForm";
import styles from "./AuthPage.module.css";
import LinkButton from "../components/ui/LinkButton";
import toast from "react-hot-toast";

const AuthPage: React.FC = () => {
  const {
    login,
    register,
    convertTempUser,
    user,
    error: authError,
  } = useAuthContext();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("register")) {
      setIsRegistering(true);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (user?.isTemporary && user.uid) {
        await convertTempUser({ id: user.uid, email, username, password });
        localStorage.removeItem("tempUserData");
      } else {
        await register({ email, username, password, isTemporary: false });
      }

      toast.success("Registration successful!");

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.logoContainer}>
        <FFTVGLogo size="large" withText />
      </div>
      <h1>{isRegistering ? "Create Your Account" : "Sign In"}</h1>
      {isRegistering ? (
        <RegisterForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleRegister}
          error={error || (authError as Error)?.message}
          isWorking={isLoading}
        />
      ) : (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
          error={error || (authError as Error)?.message}
          isWorking={isLoading}
        />
      )}
      <LinkButton onClick={() => setIsRegistering(!isRegistering)}>
        <p>
          {isRegistering
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </p>
      </LinkButton>
    </div>
  );
};

export default AuthPage;
