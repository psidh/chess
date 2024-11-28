"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useRecoilState } from "recoil";
import { emailAtom } from "@/recoil-persist/emailAtom";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useRecoilState(emailAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-950 text-white">
      <header className="flex justify-between items-center p-6 border-b border-zinc-800">
        <a href="/" className="text-3xl font-bold text-blue-500">
          Chess Bot Com | <span>{isMounted ? email : ""}</span>
        </a>
        <div className="space-x-4">
          <Button
            className="px-6 py-2 bg-black border border-neutral-700 rounded-lg"
            onClick={() => router.push("/home/profile")}
          >
            Profile
          </Button>
          <Button
            className="px-6 py-2 bg-black border border-neutral-700 rounded-lg"
            onClick={() => router.push("/home/history")}
          >
            History
          </Button>
          <a
            href="/api/auth/signout"
            className="px-6 py-2 bg-red-800 border border-neutral-700 rounded-lg"
          >
            SignOut
          </a>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-8 space-y-8">
        <h2 className="text-4xl font-extrabold tracking-wide">
          Ready to Play Chess?
        </h2>
        <p className="text-lg text-zinc-300">
          Choose how you want to play and challenge your skills.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            className="w-64 px-8 py-3 text-white
       bg-blue-600 text-lg font-semibold rounded-lg
       border border-zinc-800"
            onClick={() => router.push("/home/random-game")}
          >
            Random game
          </Button>
          <Button
            className="w-64 px-8 py-3 text-white
       bg-emerald-600 text-lg font-semibold rounded-lg
       border border-zinc-800"
            onClick={() => router.push("/1v1")}
          >
            Play 1v1
          </Button>
        </div>
      </main>

      <footer className="flex justify-center items-center p-4 border-t border-zinc-800">
        <p className="text-sm text-zinc-400">
          Made with ❤️ by Chess Bot Team. © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
