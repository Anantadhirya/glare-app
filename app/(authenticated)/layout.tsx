"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    return null;
  }

  return <>{children}</>;
}
