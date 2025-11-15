"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/sign-in");
        }
      } catch {
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    }, 400);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900"></div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
