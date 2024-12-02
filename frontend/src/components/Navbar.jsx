"use client";
import Button from "./Button";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center p-4 border-b border-zinc-800">
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
    </div>
  );
}
