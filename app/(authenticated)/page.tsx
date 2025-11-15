"use client";

import { useEffect, useState } from "react";
import { get_all_persons } from "./actions";
import { Person } from "@/components/types/person";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setIsLoading(true);
        const data = await get_all_persons();
        setPersons(data);
      } catch (err) {
        setError("Failed to load persons");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersons();
  }, []);

  return (
    <main className="grow bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Known Faces
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage and view all registered persons in the system
          </p>
        </div>

        {/* Stats Summary */}
        {!isLoading && !error && persons.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {persons.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Persons
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
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
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {persons.reduce((sum, p) => sum + p.face_count, 0)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Faces
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {persons.length > 0
                      ? (
                          persons.reduce((sum, p) => sum + p.face_count, 0) /
                          persons.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Avg. Faces/Person
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg px-6 py-4">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Loading faces...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-red-200/50 dark:border-red-700/50 shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-red-500 to-pink-500 mb-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-slate-800 dark:text-slate-100 font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && persons.length === 0 && (
          <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 mb-4">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              No faces registered yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Start by adding your first person to the system
            </p>
          </div>
        )}

        {/* Grid of Persons */}
        {!isLoading && !error && persons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {persons.map((person) => (
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                className="group bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                  {person.sample_image_url ? (
                    <Image
                      src={person.sample_image_url}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg
                        className="h-24 w-24"
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
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {person.name === "Unknown" ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-amber-600 dark:text-amber-400">
                          Unknown
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                          Identify
                        </span>
                      </span>
                    ) : (
                      person.name
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {person.face_count}{" "}
                      {person.face_count === 1 ? "face" : "faces"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
