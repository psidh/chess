"use client";
import Menubar from "./Menubar";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b border-zinc-800">
      <a href="/" className="text-2xl font-bold">
        Chess Bot Com
      </a>
      <div className="">
        <Menubar />
      </div>
    </div>
  );
}
