"use client";
import React from "react";
import { SiGithub } from "react-icons/si";
import { FaChess } from "react-icons/fa";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      <img
        src="/chess.webp"
        alt="Chess Visual"
        className="w-full md:w-1/2 h-full  object-cover opacity-90"
      />

      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight leading-snug">
            Welcome to <br />{" "}
            <span className="text-blue-500">Chess Bot Com</span>
          </h1>
          <p className="text-lg text-neutral-300">
            Play with your friends or random opponents. Outsmart your rivals and
            become the champion! 🏆
          </p>
        </div>

        <div className="flex space-x-6">
          <Button
            className="w-48 py-3 text-lg bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            onClick={() => router.push("/home")}
          >
            Play Now
          </Button>

          <a
            href="https://github.com/psidh/chess"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-x-12 justify-center w-48 py-3 bg-gradient-to-r from-blue-800 to-blue-950        
            text-lg font-semibold rounded-lg"
          >
            <span>GitHub</span>
            <SiGithub className="ml-3" size={24} />
          </a>
        </div>

        <div className="flex items-center text-neutral-500 space-x-4">
          <FaChess size={32} className="text-blue-600" />
          <p className="text-sm">
            <em>Checkmate boredom, one game at a time.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
