"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

export default function Menubar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleValueChange = (value) => {
    switch (value) {
      case "home":
        router.push("/home");
        break;
      case "profile":
        router.push("/home/profile");
        break;
      case "signout":
        logoutUser();
        break;
    }
    setIsOpen(false);
  };

  return (
    <Select 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Menu" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Navigation</SelectLabel>
          <SelectItem value="home">Home</SelectItem>
          <SelectItem value="profile">Profile</SelectItem>
          <SelectItem value="signout">Sign Out</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}