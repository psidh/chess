'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-neutral-800">
      <div className="bg-neutral-800 shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Your Account
        </h1>
        <p className="text-center text-neutral-500 mb-6">
          Sign up to start your journey with us.
        </p>

        <button
          className="w-full flex items-center justify-between gap-6 bg-white border border-neutral-300 py-2 px-4 rounded-full text-black transition duration-300"
          onClick={() => signIn('google')}
        >
          <FcGoogle className="text-4xl" />
          <p className="text-xl">SignUp with Google</p>
          <div></div>
        </button>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <button onClick={() => signIn('google')} className="text-blue-600 hover:underline">
            Log in here
          </button>
        </p>
      </div>
    </div>
  );
}
