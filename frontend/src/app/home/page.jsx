'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { userState } from '../../recoil/userAtom';
import { useRecoilState } from 'recoil';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  console.log(user.email);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-950 text-white">
      <header className="flex justify-between items-center p-6 border-b border-zinc-800">
        <a href="/" className="text-3xl font-bold tracking-tight text-blue-500">
          Chess Bot Com | {user?.email}
        </a>
        <div className="space-x-4">
          <Button
            className="px-6 py-3 text-white
       bg-gradient-to-l from-neutral-900 to-neutral-950 hover:bg-neutral-500 text-lg font-semibold rounded-lg
       border border-zinc-800 transition-all duration-150"
            onClick={() => router.push('/profile')}
          >
            Profile
          </Button>
          <Button
            className="px-6 py-3 text-white
       bg-gradient-to-l from-neutral-900 to-neutral-950 hover:bg-neutral-800 text-lg font-semibold rounded-lg
       border border-zinc-800"
            onClick={() => router.push('/history')}
          >
            History
          </Button>
          <a
            href="/api/auth/signout"
            className="w-64 px-8 py-4 text-white
       bg-gradient-to-l from-red-900 to-red-950 hover:bg-red-800 text-lg font-semibold rounded-lg
       border border-zinc-800"
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
            className="w-64 px-8 py-4 text-white
       bg-gradient-to-l from-neutral-900 to-neutral-950 hover:bg-neutral-800 text-lg font-semibold rounded-lg
       border border-zinc-800"
            onClick={() => router.push('/home/random-game')}
          >
            Random game
          </Button>
          <Button
            className="w-64 px-8 py-4 text-white
       bg-gradient-to-l from-neutral-900 to-neutral-950 hover:bg-neutral-800 text-lg font-semibold rounded-lg
       border border-zinc-800"
            onClick={() => router.push('/1v1')}
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
