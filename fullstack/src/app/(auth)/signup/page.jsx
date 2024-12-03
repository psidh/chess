"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function SignUp() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [password2, setPassword2] = React.useState("");
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  const signUpUser = async () => {
    try {
      toast.loading("Waiting...", {
        duration: 2000,
      });
      const response = await axios.post("/api/signup", user);
      console.log(response);
      if (response.status === 201) {
        toast.success("SignUp successful");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      password2.length > 0 &&
      user.password === password2
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, password2]);

  return (
    <div className="flex flex-col justify-center items-center my-24 px-4">
      <div className="login bg-neutral-950 text-black shadow-md rounded-lg p-6 w-full max-w-md">
        <Toaster />
        <h1 className="text-4xl font-bold text-neutral-300 my-8 text-center">
          SignUp
        </h1>

        <label
          htmlFor="email"
          className="block text-neutral-300 font-semibold mb-2"
        >
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

        <label
          htmlFor="password"
          className="block text-neutral-300 font-semibold mt-4 mb-2"
        >
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

        <label
          htmlFor="password2"
          className="block text-neutral-300 font-semibold mt-4 mb-2"
        >
          Re-enter Password
        </label>
        <input
          className="input block w-full px-4 py-2 border border-neutral-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="password2"
          type="password"
          placeholder="Re-enter your password"
          value={password2}
          onChange={(event) => setPassword2(event.target.value)}
        />

        {buttonDisabled ? (
          <div className="flex flex-col mt-6">
            <button
              className="my-2 px-12 py-2 bg-neutral-300 text-white font-semibold rounded-lg cursor-not-allowed"
              disabled
            >
              SignUp
            </button>
            <Link href={"/login"} className="text-blue-500 text-center mt-2">
              Already a User? Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col mt-6">
            <button
              onClick={signUpUser}
              className="auth py-2 px-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              SignUp
            </button>
            <Link href={"/login"} className="text-blue-500 text-center mt-2">
              Already a User? Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
