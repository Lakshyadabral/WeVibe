"use client";

import { useState } from "react";

export default function DeleteUserForm({ userId }: { userId: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to delete user.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <p className="text-green-600 text-sm">✅ User deleted successfully.</p>;
  }

  return (
    <div className="inline">
      <button
        onClick={handleDelete}
        disabled={submitting}
        className="text-red-600 hover:underline text-xs"
      >
        {submitting ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
