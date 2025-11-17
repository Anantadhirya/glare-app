"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  get_person_details,
  update_person_name,
  delete_person,
} from "./actions";
import { PersonDetails } from "@/components/types/person";
import toast from "react-hot-toast";

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setIsLoading(true);
        const data = await get_person_details(id);
        setPerson(data);
        setEditedName(data.name);
      } catch (err) {
        setError("Failed to load person details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  const handleSaveName = async () => {
    if (!editedName.trim() || !person) return;

    try {
      setIsSaving(true);
      await update_person_name(id, editedName.trim());
      setPerson({ ...person, name: editedName.trim() });
      setIsEditing(false);
      toast.success("Name updated successfully!");
    } catch (err) {
      toast.error("Failed to update name");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await delete_person(id);
      toast.success("Person deleted successfully!");
      router.push("/");
    } catch (err) {
      toast.error("Failed to delete person");
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(person?.name || "");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <main className="grow bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg px-6 py-4">
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Loading person details...
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !person) {
    return (
      <main className="grow bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <p className="text-slate-800 dark:text-slate-100 font-semibold mb-4">
              {error || "Person not found"}
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white bg-linear-to-br from-blue-600 to-indigo-600 shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grow bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all persons
        </button>

        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-2 text-2xl font-bold border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Person name"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving || !editedName.trim()}
                      className="px-4 py-2 rounded-md font-medium text-white bg-linear-to-br from-green-600 to-emerald-600 shadow hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-md font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
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
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
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
                      {person.faces.length}{" "}
                      {person.faces.length === 1 ? "face" : "faces"}
                    </span>
                    <span className="flex items-center gap-1">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Added {new Date(person.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Edit name"
                >
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete person"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Face Images Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Face Images
          </h2>

          {person.faces.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-slate-400 to-slate-500 mb-4">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                No face images yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Face images will appear here once they are added to this person.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {person.faces.map((face) => (
                <Link
                  key={face.id}
                  href={`/face/${face.id}`}
                  className="group bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Face Image */}
                  <div className="aspect-square bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                    <Image
                      src={face.image_url}
                      alt={`Face of ${person.name}`}
                      fill
                      className="object-cover"
                    />
                    {face.verified && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Face Info */}
                  <div className="p-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                      {new Date(face.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center shrink-0">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Delete Person
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Are you sure you want to delete <strong>{person.name}</strong>?
              This will permanently remove this person and all{" "}
              {person.faces.length} associated face
              {person.faces.length === 1 ? "" : "s"}.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-md font-medium text-white bg-linear-to-br from-red-600 to-pink-600 shadow hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-md font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
