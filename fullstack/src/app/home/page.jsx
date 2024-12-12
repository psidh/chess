"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

export default function Page() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-950 text-white">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-grow p-6 space-y-4">
        <img src="https://img.etimg.com/thumb/width-1200,height-1200,imgsize-832996,resizemode-75,msid-109832236/wealth/earn/9-time-tested-principles-used-in-chess-that-can-improve-the-win-rate-in-your-job-and-career.jpg" alt="" className="w-1/2 md:w-[30%] rounded-3xl" />
        <h2 className="text-4xl font-extrabold tracking-wide">
          Ready to Play Chess?
        </h2>
        <p className="text-lg text-zinc-300">
          Choose how you want to play and challenge your skills.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            className="w-64 px-8 py-3 bg-neutral-800 text-lg font-semibold rounded-lg
       "
            onClick={() => router.push("/home/random-game")}
          >
            Random game
          </Button>
          <Button
            className="w-64 px-8 py-3
       bg-white text-black  text-lg font-semibold rounded-lg"
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
