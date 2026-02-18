"use client";

import { useEffect, useState } from "react";

export default function HeroMedia() {
  const [type, setType] = useState("image");
  const [videoUrl, setVideoUrl] = useState("");
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch current hero on load
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hero");
        const data = await res.json();

        if (data) {
          setType(data.type);
          if (data.type === "video") {
            setVideoUrl(data.videoUrl || "");
          } else {
            setImages(data.images?.join(", ") || "");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchHero();
  }, []);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("adminToken");

    const body =
      type === "video"
        ? { type, videoUrl }
        : { type, images: images.split(",").map((img) => img.trim()) };

    try {
      const res = await fetch(`${API_BASE_URL}/api/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">

        <h1 className="text-3xl font-bold">Hero Section Settings</h1>

        {/* Type Selector */}
        <div>
          <label className="block font-medium mb-2">
            Select Hero Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
          >
            <option value="image">Images (Max 10)</option>
            <option value="video">YouTube Video</option>
          </select>
        </div>

        {/* Video Input */}
        {type === "video" && (
          <div>
            <label className="block font-medium mb-2">
              YouTube Video URL
            </label>
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=xxxxx"
              className="w-full border rounded-lg p-3"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
        )}

        {/* Image Input */}
        {type === "image" && (
          <div>
            <label className="block font-medium mb-2">
              Image URLs (comma separated)
            </label>
            <textarea
              rows={4}
              placeholder="https://image1.jpg, https://image2.jpg"
              className="w-full border rounded-lg p-3"
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Saving..." : "Save Hero Settings"}
        </button>

        {/* Success Message */}
        {message && (
          <p className="text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
