import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getPendingRegistration, removePendingRegistration, savePendingRegistration } from "../utils/offlineRegister";
import api, { setAccessToken } from "../config/AxiosInstance";

export const useLogin =()=>{

        const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login data:", data);

    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          email: data.email.trim().toLowerCase(),
          password: data.password,
        },
      );

      console.log("Login response:", response.data);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/main");
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
    }
  };

  return {
    register,handleSubmit,onSubmit,errors,navigate
  }
}

export const useRegister = ()=>{
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Prevent duplicate registration requests
  const isSyncingRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const syncRegistration = async () => {
    const pendingUser = getPendingRegistration();

    if (!pendingUser || !navigator.onLine) return;

    if (isSyncingRef.current) return;

    isSyncingRef.current = true;
    setIsSyncing(true);
    setMessage("Internet connected. Registering your account...");

    try {
      const response = await api.post("/register", pendingUser);

      // Access token lives in memory only (used by the axios interceptor).
      // The refresh token arrives as an httpOnly cookie set by the server.
      setAccessToken(response.data.accessToken);

      // Save registered user (safe to keep in localStorage — it's not a secret)
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Remove pending registration
      removePendingRegistration();

      setMessage("Registration successful!");

      // Go to dashboard
      navigate("/main", { replace: true });
    } catch (error) {
      console.error(
        "Registration sync error:",
        error.response?.data || error.message,
      );

      const errorMessage = error.response?.data?.message;

      // User already exists
      if (errorMessage === "User already exists") {
        removePendingRegistration();
        setMessage("User already exists. Please login.");

        navigate("/", { replace: true });

        return;
      }

      // Other errors → keep pending registration
      setMessage(errorMessage || "Registration failed. Please try again.");
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  };
  useEffect(() => {
    const handleOnline = () => {
      console.log("Internet connected!");
      syncRegistration();
    };

    window.addEventListener("online", handleOnline);

    // Check if a pending request already exists
    syncRegistration();

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const onSubmit = async (data) => {
    if (!navigator.onLine) {
      savePendingRegistration(data);

      setMessage(
        "You are offline. Your registration will be submitted automatically when internet returns.",
      );

      return;
    }

    try {
      const response = await api.post("/register", data);

      setAccessToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/main", { replace: true });
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message,
      );

      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return {
    message,onSubmit,handleSubmit,errors,register,isSyncing,navigate
  }

}