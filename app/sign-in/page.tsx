"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }
    setTimeout(() => {
      if (
        email === process.env.NEXT_PUBLIC_DEMO_EMAIL &&
        password === process.env.NEXT_PUBLIC_DEMO_PASSWORD
      ) {
        setMessage("Sign-in successful! Redirecting...");
        setTimeout(() => router.replace("/"), 400);
        localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      } else {
        setMessage("Invalid email or password.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-6">
      {/* Header (small) */}
      <header className="absolute top-6 left-6 right-6 md:left-12 md:right-auto flex items-center justify-center md:justify-start">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            GLARE
          </h1>
        </div>
      </header>

      {/* Card */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2 text-center">
          Sign in to GLARE
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your password"
            />
          </div>

          {message && (
            <div className="text-sm text-center text-slate-700 dark:text-slate-200">
              {message}
            </div>
          )}

          <button
            className="w-full inline-flex items-center justify-center rounded-md py-2 font-semibold text-white bg-linear-to-br from-blue-600 to-indigo-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
