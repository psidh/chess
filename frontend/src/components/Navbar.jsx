"use client";
import Button from "./Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const logoutUser = async () => {
    try {
      await axios.get("/api/logout");
      toast.success("Logout successful", {
        duration: 2000,
      });
      router.push("/");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-between items-center p-4 border-b border-zinc-800">
      <a href="/" className="text-2xl font-bold text-blue-500">
        Chess Bot Com
      </a>
      <div className="space-x-2 font-medium">
        <Button
          className="px-4 py-2 bg-black border border-neutral-700 rounded-lg"
          onClick={() => router.push("/home")}
        >
          Home
        </Button>
        <Button
          className="px-4 py-2 bg-black border border-neutral-700 rounded-lg"
          onClick={() => router.push("/home/profile")}
        >
          Profile
        </Button>
        <Button
          onClick={logoutUser}
          className="px-4 py-2 border-red-800 bg-red-950 border rounded-lg"
        >
          SignOut
        </Button>
      </div>
    </div>
  );
}
