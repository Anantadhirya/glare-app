"use client";

import Link from "next/link";
import { useState } from "react";
import { AddModal } from "./AddModal";
import { usePendingCount } from "./PendingCountProvider";

export function Navbar() {
  const { pendingCount } = usePendingCount();
  const [showAddModal, setShowAddModal] = useState(false);
  const userEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || "user@example.com";

  return (
    <>
      <nav className="bg-white/80 dark:bg-slate-800/70 backdrop-blur border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow group-hover:shadow-md transition-shadow">
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
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {/* Add Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white bg-linear-to-br from-blue-600 to-indigo-600 shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-lg"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </button>

              {/* Verification/Inbox Icon */}
              <Link
                href="/verification"
                className="relative p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                {/* Badge for pending verifications */}
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-linear-to-br from-red-500 to-pink-500 text-white text-xs flex items-center justify-center font-semibold shadow">
                    {pendingCount}
                  </span>
                )}
              </Link>

              {/* User Email (optional, shown on larger screens) */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">{userEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Add Modal - rendered outside nav to fix position: fixed */}
      <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
