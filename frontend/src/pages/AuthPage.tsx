import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import styles from "./AuthPage.module.css";
import LinkButton from "../components/ui/LinkButton";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import FFTVGLogo from "../assets/FFTVGLogo";

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    login,
    register,
    isLoading: authLoading,
    error: authError,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setIsRegister(searchParams.get("register") === "true");
  }, [location]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isRegister) {
        await register({ username, email, password });
      } else {
        await login({ email, password });
      }

      navigate("/");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      <div className={styles.logoContainer}>
        <FFTVGLogo size="large" withText />
      </div>
      <h1>{isRegister ? "Create Your Account" : "Sign In"}</h1>
      {isRegister ? (
        <RegisterForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          error={error || (authError as Error)?.message}
        />
      ) : (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          error={error || (authError as Error)?.message}
        />
      )}
      <div className={styles.linkContainer}>
        <LinkButton
          to={isRegister ? "/auth?register=false" : "/auth?register=true"}
        >
          {isRegister
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </LinkButton>
      </div>
    </div>
  );
};

export default AuthPage;
