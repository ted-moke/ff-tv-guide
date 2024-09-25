import React, { useState, useEffect } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import FFTVGLogo from "../assets/FFTVGLogo";
import RegisterForm from "../components/forms/RegisterForm";
import LoginForm from "../components/forms/LoginForm";
import styles from "./AuthPage.module.css";
import LinkButton from "../components/ui/LinkButton";

const AuthPage: React.FC = () => {
  const {
    login,
    register,
    convertTempUser,
    user,
    error: authError,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("register")) {
      setIsRegistering(true);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.isTemporary && user.uid) {
        await convertTempUser({ id: user.uid, email, username, password });
        localStorage.removeItem("tempUserData");
      } else {
        await register({ email, username, password, isTemporary: false });
      }

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Registration failed:", error);
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
        />
      ) : (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
          error={error || (authError as Error)?.message}
        />
      )}
      <LinkButton onClick={() => setIsRegistering(!isRegistering)}>
        <p>{isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</p>
      </LinkButton>
    </div>
  );
};

export default AuthPage;
