"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { get_face_details, update_face, delete_face } from "./actions";
import { Face } from "@/components/types/face";
import { PersonSelect } from "@/components/layout/PersonSelect";
import toast from "react-hot-toast";

export default function FaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [face, setFace] = useState<Face | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const faceData = await get_face_details(id);
        setFace(faceData);
        setSelectedPersonId(faceData.person_id);
        setIsVerified(faceData.verified);
      } catch (err) {
        setError("Failed to load face details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!face || !selectedPersonId) return;

    try {
      setIsSaving(true);
      await update_face(id, isVerified, selectedPersonId);
      // Refresh face data to get updated person name
      const updatedFace = await get_face_details(id);
      setFace(updatedFace);
      setIsEditing(false);
      toast.success("Face updated successfully!");
    } catch (err) {
      toast.error("Failed to update face");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await delete_face(id);
      toast.success("Face deleted successfully!");
      router.push("/");
    } catch (err) {
      toast.error("Failed to delete face");
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    if (!face) return;
    setSelectedPersonId(face.person_id);
    setIsVerified(face.verified);
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
                Loading face details...
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !face) {
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
              {error || "Face not found"}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/person/${face.person_id}`)}
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
          Back to {face.person_name}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Face Image
            </h2>
            <div className="aspect-square bg-slate-200 dark:bg-slate-700 relative overflow-hidden rounded-lg">
              <Image
                src={face.image_url}
                alt={`Face of ${face.person_name}`}
                fill
                className="object-cover"
              />
              {face.verified && (
                <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2 shadow-lg">
                  <svg
                    className="h-5 w-5 text-white"
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
          </div>

          {/* Details Section */}
          <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Face Details
              </h2>

              {!isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Edit face"
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
                    title="Delete face"
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

            {isEditing ? (
              <div className="space-y-4">
                {/* Person Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Assigned Person
                  </label>
                  <PersonSelect
                    value={selectedPersonId}
                    onSelect={(id) => setSelectedPersonId(id)}
                    disabled={isSaving}
                  />
                </div>

                {/* Verified Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Verified
                    </span>
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 ml-8">
                    Mark this face as verified and correctly identified
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !selectedPersonId}
                    className="flex-1 px-4 py-2 rounded-md font-medium text-white bg-linear-to-br from-green-600 to-emerald-600 shadow hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 rounded-md font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Person
                  </p>
                  <Link
                    href={`/person/${face.person_id}`}
                    className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {face.person_name}
                  </Link>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    {face.verified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
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
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Created At
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {new Date(face.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
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
                  Delete Face
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Are you sure you want to delete this face image of{" "}
              <strong>{face.person_name}</strong>? This will permanently remove
              this face from the system.
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
