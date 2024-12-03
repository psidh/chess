"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/check");
      console.log(response);

      if (response.status == 200) {
        router.push("/home");
      }
    };
    fetchData();
  }, []);

  const handleLogin = async () => {
    try {
      toast.loading("Waiting...", {
        duration: 2000,
      });
      const response = await axios.post("/api/login", user);
      console.log(response);
      toast.success("SignUp successful");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center my-24 ">
      <div className="login">
        <Toaster />
        <h1 className="text-4xl font-bold text-neutral-300 my-8 text-center">
          SignUp
        </h1>

        <label htmlFor="email" className="mb-2 font-semibold">
          Email
        </label>
        <input
          className="input block w-full px-4 py-2 border border-neutral-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={user.email}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
        />

        <label htmlFor="password" className="mb-2 font-semibold">
          Password
        </label>
        <input
          className="input block w-full px-4 py-2 border border-neutral-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="password"
          type="password"
          placeholder="Enter your password"
          value={user.password}
          onChange={(event) =>
            setUser({ ...user, password: event.target.value })
          }
        />
        {buttonDisabled ? (
          <div className="flex flex-col">
            <button
              className="my-2 px-12 py-1 border text-gray-300 w-full bg-gray-500 rounded-lg"
              disabled
            >
              Login
            </button>
            <Link href={"/signup"}>New User? SignUp</Link>
          </div>
        ) : (
          <div className="flex flex-col">
            <button onClick={handleLogin} className="auth">
              Login
            </button>
            <Link href={"/signup"}>New User? SignUp</Link>
          </div>
        )}
      </div>
    </div>
  );
}
