"use client";

import { useState, useEffect } from "react";
import { get_unverified_faces, update_face } from "./actions";
import { Face } from "@/components/types/face";
import { PersonSelect } from "@/components/layout/PersonSelect";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { delete_face } from "../face/[id]/actions";
import { usePendingCount } from "@/components/layout/PendingCountProvider";

export default function VerificationPage() {
  const { refreshPendingCount } = usePendingCount();
  const [faces, setFaces] = useState<Face[]>([]);
  const [selectedFace, setSelectedFace] = useState<Face | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // For both identifying unknown and verifying suggested persons
  const [selectedPersonId, setSelectedPersonId] = useState("");

  useEffect(() => {
    fetchFaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFace) {
      // Reset form state when selecting a new face
      if (selectedFace.person_name === "Unknown") {
        // Unknown person - need to identify
        setSelectedPersonId("");
        setSelectedGroupId(selectedFace.person_id);
      } else {
        // Suggested person - need to verify
        setSelectedPersonId(selectedFace.person_id);
        setSelectedGroupId(null);
      }
    }
  }, [selectedFace]);

  const fetchFaces = async () => {
    try {
      setIsLoading(true);
      const data = await get_unverified_faces();
      setFaces(data);
      if (data.length > 0 && !selectedFace) {
        setSelectedFace(data[0]);
      }
    } catch (err) {
      console.error("Failed to load faces:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdentifyUnknown = async () => {
    if (!selectedFace || !selectedPersonId) return;

    const groupPersonId = selectedFace.person_id;
    const groupFaces = faces.filter((f) => f.person_id === groupPersonId);

    try {
      setProcessingId(groupPersonId);

      // Assign all faces in the group to the selected person and mark as verified
      await Promise.all(
        groupFaces.map((face) => update_face(face.id, true, selectedPersonId))
      );

      // Remove all grouped faces from list
      const updatedFaces = faces.filter((f) => f.person_id !== groupPersonId);
      setFaces(updatedFaces);
      setSelectedFace(updatedFaces[0] || null);
      setSelectedGroupId(null);
      setSelectedPersonId("");
      refreshPendingCount();
    } catch (err) {
      alert("Failed to identify person");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerifySuggested = async () => {
    if (!selectedFace || !selectedPersonId) return;

    try {
      setProcessingId(selectedFace.id);
      // Update with selected person (could be same or different) and mark as verified
      await update_face(selectedFace.id, true, selectedPersonId);

      // Remove from list
      const updatedFaces = faces.filter((f) => f.id !== selectedFace.id);
      setFaces(updatedFaces);
      setSelectedFace(updatedFaces[0] || null);
      refreshPendingCount();
    } catch (err) {
      alert("Failed to verify face");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedFace) return;

    if (
      !confirm("Are you sure you want to reject this face? It will be deleted.")
    ) {
      return;
    }

    try {
      setProcessingId(selectedFace.id);
      await delete_face(selectedFace.id);

      const updatedFaces = faces.filter((f) => f.id !== selectedFace.id);
      setFaces(updatedFaces);
      setSelectedFace(updatedFaces[0] || null);
      refreshPendingCount();
    } catch (err) {
      alert("Failed to reject face");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectUnknown = async () => {
    if (!selectedFace) return;

    const groupPersonId = selectedFace.person_id;
    const groupFaces = faces.filter((f) => f.person_id === groupPersonId);

    const message =
      groupFaces.length > 1
        ? `Are you sure you want to reject all ${groupFaces.length} faces in this group? They will all be deleted.`
        : "Are you sure you want to reject this face? It will be deleted.";

    if (!confirm(message)) {
      return;
    }

    try {
      setProcessingId(groupPersonId);

      // Delete all faces in the group
      await Promise.all(groupFaces.map((face) => delete_face(face.id)));

      // Remove all grouped faces from list
      const updatedFaces = faces.filter((f) => f.person_id !== groupPersonId);
      setFaces(updatedFaces);
      setSelectedFace(updatedFaces[0] || null);
      setSelectedGroupId(null);
      setSelectedPersonId("");
      refreshPendingCount();
    } catch (err) {
      alert("Failed to reject faces");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const isUnknown = selectedFace && selectedFace.person_name === "Unknown";

  // Group faces by person_id for unknown persons
  const groupedUnknownFaces = faces
    .filter((f) => f.person_name === "Unknown")
    .reduce((groups, face) => {
      const key = face.person_id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(face);
      return groups;
    }, {} as Record<string, Face[]>);

  // Get faces in the selected group
  const selectedGroupFaces = selectedGroupId
    ? groupedUnknownFaces[selectedGroupId] || []
    : [];

  return (
    <div className="grow bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Face Verification
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Review and verify newly identified faces
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg px-6 py-4">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Loading pending verifications...
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && faces.length === 0 && (
          <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-green-500 to-emerald-600 mb-4">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              All caught up!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              No pending face verifications at the moment.
            </p>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && faces.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List View */}
            <div className="lg:col-span-2 space-y-4">
              {/* Grouped Unknown Persons */}
              {Object.entries(groupedUnknownFaces).map(
                ([personId, groupFaces]) => (
                  <div
                    key={personId}
                    onClick={() => setSelectedFace(groupFaces[0])}
                    className={`bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border ${
                      selectedGroupId === personId
                        ? "border-amber-500 dark:border-amber-400 shadow-lg"
                        : "border-slate-200/50 dark:border-slate-700/50 shadow"
                    } p-4 cursor-pointer hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Face Images Grid */}
                      <div className="shrink-0">
                        <div className="grid grid-cols-2 gap-1.5 w-20 sm:w-28">
                          {groupFaces
                            .slice(
                              0,
                              groupFaces.length > 4 ? 3 : groupFaces.length
                            )
                            .map((face) => (
                              <div
                                key={face.id}
                                className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 relative"
                              >
                                <Image
                                  src={face.image_url}
                                  alt="Face"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          {groupFaces.length > 4 && (
                            <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-md bg-slate-300 dark:bg-slate-600 border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                +{groupFaces.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                              <span className="inline-flex items-center gap-2">
                                <span className="text-amber-600 dark:text-amber-400">
                                  Unknown Person
                                </span>
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                                  Identify
                                </span>
                              </span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              {groupFaces.length}{" "}
                              {groupFaces.length === 1 ? "face" : "faces"}{" "}
                              detected
                            </p>
                          </div>
                          <div className="shrink-0">
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Individual Suggested Persons */}
              {faces
                .filter((f) => f.person_name !== "Unknown")
                .map((face) => (
                  <div
                    key={face.id}
                    onClick={() => setSelectedFace(face)}
                    className={`bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border ${
                      selectedFace?.id === face.id
                        ? "border-blue-500 dark:border-blue-400 shadow-lg"
                        : "border-slate-200/50 dark:border-slate-700/50 shadow"
                    } p-4 cursor-pointer hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Face Image */}
                      <div className="shrink-0">
                        <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 relative">
                          <Image
                            src={face.image_url}
                            alt="Face"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                              <span>{face.person_name}</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              {formatDate(face.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Verification Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 sticky top-6">
                {selectedFace ? (
                  <div className="space-y-6">
                    {/* Image(s) */}
                    {isUnknown && selectedGroupFaces.length > 1 ? (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                          {selectedGroupFaces.length} faces in this group
                        </p>
                        <div className="grid grid-cols-3 gap-2 max-h-86 overflow-y-auto">
                          {selectedGroupFaces.map((face) => (
                            <div
                              key={face.id}
                              className="aspect-square rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 relative"
                            >
                              <Image
                                src={face.image_url}
                                alt="Face"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 relative">
                        <Image
                          src={selectedFace.image_url}
                          alt="Face"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Unknown Person Flow */}
                    {isUnknown ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                          <svg
                            className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0"
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
                          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                            This person needs to be identified
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Select or Add Person
                          </label>
                          <PersonSelect
                            value={selectedPersonId}
                            onSelect={(id) => setSelectedPersonId(id)}
                            disabled={processingId === selectedFace.person_id}
                            placeholder="Search or add person..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleIdentifyUnknown}
                            disabled={
                              !selectedPersonId ||
                              processingId === selectedFace.person_id
                            }
                            className="flex-1 px-4 py-2 rounded-md font-medium text-white bg-linear-to-br from-blue-600 to-indigo-600 shadow hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === selectedFace.person_id
                              ? "Saving..."
                              : selectedGroupFaces.length > 1
                              ? `Identify All ${selectedGroupFaces.length} Faces`
                              : "Identify & Verify"}
                          </button>
                          <button
                            onClick={handleRejectUnknown}
                            disabled={processingId === selectedFace.person_id}
                            className="px-4 py-2 rounded-md font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Suggested Person Flow */
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <svg
                            className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                            Verify predicted identity
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Select Person (Predicted: {selectedFace.person_name}
                            )
                          </label>
                          <PersonSelect
                            value={selectedPersonId}
                            onSelect={(id) => setSelectedPersonId(id)}
                            disabled={processingId === selectedFace.id}
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleVerifySuggested}
                            disabled={
                              !selectedPersonId ||
                              processingId === selectedFace.id
                            }
                            className="flex-1 px-4 py-2 rounded-md font-medium text-white bg-linear-to-br from-green-600 to-emerald-600 shadow hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === selectedFace.id
                              ? "Verifying..."
                              : "✓ Verify"}
                          </button>
                          <button
                            onClick={handleReject}
                            disabled={processingId === selectedFace.id}
                            className="px-4 py-2 rounded-md font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                            Created At
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {new Date(selectedFace.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="h-12 w-12 mx-auto text-slate-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select a face to verify
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
