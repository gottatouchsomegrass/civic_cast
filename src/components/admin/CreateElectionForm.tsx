// app/components/admin/CreateElectionForm.tsx
"use client";

import React, { useState } from "react";

export default function CreateElectionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // FIX: The state now only tracks the title of each post
  const [posts, setPosts] = useState<{ title: string }[]>([{ title: "" }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPost = () => {
    setPosts([...posts, { title: "" }]);
  };

  const handlePostChange = (index: number, value: string) => {
    const newPosts = [...posts];
    newPosts[index].title = value;
    setPosts(newPosts);
  };

  const handleRemovePost = (index: number) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/elections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, startDate, endDate, posts }),
    });

    setLoading(false);

    if (response.ok) {
      setMessage("Election created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setPosts([{ title: "" }]);
    } else {
      setMessage("Failed to create election.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Election Title (e.g., Student Union 2025)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="input-style"
      />
      <textarea
        placeholder="Election Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-style h-24"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="datetime-local"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="input-style"
        />
        <input
          type="datetime-local"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="input-style"
        />
      </div>

      <h3 className="text-xl font-semibold text-white pt-4 border-t border-gray-700">
        Election Posts
      </h3>

      {posts.map((post, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-3 border border-gray-700 rounded-lg bg-gray-900/50"
        >
          <input
            type="text"
            placeholder={`Post Title #${index + 1} (e.g., President)`}
            value={post.title}
            onChange={(e) => handlePostChange(index, e.target.value)}
            required
            className="input-style flex-grow"
          />
          {posts.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemovePost(index)}
              className="text-red-500 hover:text-red-400 font-bold text-2xl p-1"
            >
              &times;
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddPost}
        className="w-full text-center py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      >
        + Add Another Post
      </button>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-lg font-bold py-3 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:bg-red-800"
      >
        {loading ? "Creating..." : "Create Election"}
      </button>

      {message && (
        <p
          className={`text-center ${
            message.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
