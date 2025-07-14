"use client";

import React, { useState, useEffect } from "react";
import type { User, Election } from "@/types";
import UserTable from "@/components/admin/UserTable";
import { UserPlus, Upload } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// The form is now updated to handle file uploads
function RegisterCandidateForm({
  elections,
  onCandidateAdded,
}: {
  elections: Election[];
  onCandidateAdded: (newUser: User) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [electionPost, setElectionPost] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const availablePosts =
    elections.find((e) => e._id === selectedElectionId)?.posts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePictureFile) {
      setError("Profile picture is required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Step 1: Upload the image to Cloudinary
      const formData = new FormData();
      formData.append("file", profilePictureFile);

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Image upload failed.");
      }
      const profilePictureUrl = uploadData.url;

      // Step 2: Register the candidate with the image URL
      const candidateResponse = await fetch("/api/register-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          electionId: selectedElectionId,
          electionPost,
          profilePicture: profilePictureUrl, // Use the URL from Cloudinary
        }),
      });

      const candidateData = await candidateResponse.json();
      if (candidateResponse.ok) {
        setMessage(`Candidate ${name} registered successfully!`);
        onCandidateAdded(candidateData);
        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setProfilePictureFile(null);
        setSelectedElectionId("");
        setElectionPost("");
      } else {
        throw new Error(
          candidateData.message || "Failed to register candidate."
        );
      }
    } catch (err) {
      console.error("An operation failed:", err);

      let errorMessage = "An unexpected error occurred.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input-style"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input-style"
      />
      <input
        type="password"
        placeholder="Set Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="input-style"
      />

      {/* File Input for Profile Picture */}
      <label
        htmlFor="file-upload"
        className="input-style flex items-center justify-center gap-2 cursor-pointer"
      >
        <Upload className="h-4 w-4" />
        <span>
          {profilePictureFile
            ? profilePictureFile.name
            : "Upload Profile Picture"}
        </span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={(e) =>
          setProfilePictureFile(e.target.files ? e.target.files[0] : null)
        }
        className="hidden"
      />

      <select
        value={selectedElectionId}
        onChange={(e) => setSelectedElectionId(e.target.value)}
        required
        className="input-style"
      >
        <option value="" disabled>
          Select an Election
        </option>
        {elections.map((election) => (
          <option key={election._id} value={election._id}>
            {election.title}
          </option>
        ))}
      </select>

      <select
        value={electionPost}
        onChange={(e) => setElectionPost(e.target.value)}
        required
        className="input-style"
        disabled={!selectedElectionId}
      >
        <option value="" disabled>
          Select a Post
        </option>
        {availablePosts.map((post) => (
          <option key={post.title} value={post.title}>
            {post.title}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-800"
      >
        {loading ? "Processing..." : "Register Candidate"}
      </button>

      {message && (
        <p className="text-center text-green-500 text-sm mt-2">{message}</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  );
}

// The main page component (logic remains the same)
export default function ManageCandidatesPage() {
  const [candidates, setCandidates] = useState<User[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, electionsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/elections"),
        ]);
        if (!usersRes.ok || !electionsRes.ok)
          throw new Error("Could not fetch required data.");

        const usersData = await usersRes.json();
        const electionsData = await electionsRes.json();

        setCandidates(usersData.candidates);
        setElections(electionsData);
      } catch (err) {
        console.error("An operation failed:", err);

        let errorMessage = "An unexpected error occurred.";

        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCandidateAdded = (newCandidate: User) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  const handleDeleteCandidate = async (id: string) => {
    if (confirm("Are you sure you want to remove this candidate?")) {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Loading Candidates..." />
      </div>
    );
  }
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Manage Candidates</h2>
        <p className="text-gray-400 mt-1">
          Register new candidates and assign them to elections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#181818] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Candidates List
          </h3>
          <UserTable
            users={candidates}
            onDelete={handleDeleteCandidate}
            isCandidateTable={true}
          />
        </div>

        <div className="bg-[#181818] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Candidate
          </h3>
          <RegisterCandidateForm
            elections={elections}
            onCandidateAdded={handleCandidateAdded}
          />
        </div>
      </div>
    </div>
  );
}
