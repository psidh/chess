"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { emailAtom } from "@/recoil-persist/emailAtom";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useRecoilState(emailAtom); // Use Recoil state for email

  // Redirect unauthenticated users
  if (status === "unauthenticated") {
    router.push("/");
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setEmail(session.user.email);
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:3002/api/auth/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (response.ok) {
            const data = await response.json();
            toast.success(data.message, { duration: 5000 });
            router.push("/home");
          } else {
            console.error("Error:", response.statusText);
          }
        } catch (error) {
          console.error("Failed to fetch:", error);
        }
      };

      fetchData();
    }
  }, [session, status, setEmail, router]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-2xl">Redirecting...</h1>
      <p>{email}</p>
    </div>
  );
}
