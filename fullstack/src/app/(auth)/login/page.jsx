"use client";
import Link from "next/link";
import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useRecoilState } from "recoil";
import { emailAtom } from "@/recoil-persist/emailAtom";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useRecoilState(emailAtom);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await axios.get("/check", {
        timeout: 3000,

        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.status === 200) {
        router.replace("/home");
      }
    } catch (error) {
      console.error("Authentication check failed");
    }
  }, [router]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleLogin = async () => {
    try {
      const loadingToast = toast.loading("Logging in...", {
        duration: 2000,
      });

      const response = await axios.post("/api/login", user, {
        timeout: 5000,
      });

      setEmail(response.data.email);

      toast.dismiss(loadingToast);
      toast.success("Login successful");

      router.prefetch("/home");
      router.replace("/home", { scroll: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user.email, user.password]);

  return (
    <div className="flex flex-col justify-center items-center my-24">
      <div className="login">
        <Toaster />
        <h1 className="text-4xl font-bold text-neutral-300 my-8 text-center">
          Login
        </h1>
        <label htmlFor="email" className="mb-4 font-semibold">
          Email
        </label>
        <input
          className="input mb-6"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={user.email}
          onChange={(event) =>
            setUser((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <label htmlFor="password" className="mb-4 font-semibold">
          Password
        </label>
        <input
          className="input mb-6"
          id="password"
          type="password"
          placeholder="Enter your password"
          value={user.password}
          onChange={(event) =>
            setUser((prev) => ({ ...prev, password: event.target.value }))
          }
        />
        {buttonDisabled ? (
          <div className="flex flex-col">
            <button
              className="my-2 px-12 py-1 border border-neutral-600 text-neutral-300 w-full bg-neutral-500 rounded-lg"
              disabled
            >
              Login
            </button>
            <Link href="/signup" prefetch>
              New User? SignUp
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            <button onClick={handleLogin} className="auth">
              Login
            </button>
            <Link href="/signup" prefetch>
              New User? SignUp
            </Link>
            <a href="/home" className="text-semibold mt-6 ">Did not get redirected? <span className="hover:text-blue-600 hover:underline">Go to Home</span></a>
          </div>
        )}
      </div>
    </div>
  );
}
