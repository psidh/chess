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
      <header className="flex justify-between items-center p-4 border-b border-zinc-800">
        <a href="/" className="text-2xl font-bold text-blue-500">
          Chess Bot Com
        </a>
        <div className="space-x-2 font-medium">
          <Button
            className="px-4 py-2 bg-black border border-neutral-700 rounded-lg"
            onClick={() => router.push("/home/profile")}
          >
            Profile
          </Button>
          <a
            href="/api/auth/signout"
            className="px-4 py-2 border-red-800 bg-red-950 border rounded-lg"
          >
            SignOut
          </a>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-6 space-y-4">
        <img src="/chess.svg" alt="" className="w-1/2 md:w-[30%]" />
        <h2 className="text-4xl font-extrabold tracking-wide">
          Ready to Play Chess?
        </h2>
        <p className="text-lg text-zinc-300">
          Choose how you want to play and challenge your skills.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            className="w-64 px-8 py-3 text-white
       bg-gradient-to-r from-blue-800/20 via-blue-800 to-blue-800/20 text-lg font-semibold rounded-lg
       border border-zinc-800"
            onClick={() => router.push("/home/random-game")}
          >
            Random game
          </Button>
          <Button
            className="w-64 px-8 py-3 text-white
       bg-gradient-to-r from-sky-800/20 via-sky-800 to-sky-800/20 text-lg font-semibold rounded-lg
       border border-zinc-800"
            onClick={() => router.push("/home/1v1")}
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
