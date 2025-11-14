"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          router.replace("/");
        }
      } catch {}
    }, 400);
  }, [router]);

  return <>{children}</>;
}
