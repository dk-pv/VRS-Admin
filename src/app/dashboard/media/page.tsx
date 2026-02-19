"use client";

import { useEffect, useState, useRef } from "react";

interface HeroData {
  type: "image" | "video";
  images?: string[];
  videoUrl?: string;
}

export default function HeroMedia() {
  const [type, setType] = useState<"image" | "video">("image");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [savedVideo, setSavedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch hero
  useEffect(() => {
    const fetchHero = async () => {
      const res = await fetch(`${API_BASE_URL}/api/hero`);
      const data = await res.json();

      if (data) {
        setType(data.type);
        setSavedImages(data.images || []);
        setSavedVideo(data.videoUrl || null);
      }
    };

    if (API_BASE_URL) fetchHero();
  }, [API_BASE_URL]);

  // Add files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    if (type === "image") {
      const total = [...savedImages, ...selectedFiles, ...newFiles];

      if (total.length > 10) {
        setMessage("Maximum 10 images allowed");
        return;
      }

      setSelectedFiles([...selectedFiles, ...newFiles]);
    } else {
      setSelectedFiles([newFiles[0]]);
    }
  };

  // Remove new image (before save)
  const removeNewImage = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
  };

  // Remove saved image (after save)
  const removeSavedImage = async (index: number) => {
    const updatedImages = savedImages.filter((_, i) => i !== index);

    setSavedImages(updatedImages);

    // Update DB
    await fetch(`${API_BASE_URL}/api/hero/remove-image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: updatedImages }),
    });
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 && type === "image") {
      setMessage("No new images selected");
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("type", type);

    if (type === "image") {
      selectedFiles.forEach((file) => formData.append("images", file));
    } else {
      formData.append("video", selectedFiles[0]);
    }

    const res = await fetch(`${API_BASE_URL}/api/hero`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage("Upload failed");
    } else {
      setMessage("Hero updated successfully ✅");

      // Merge new images with saved images
      if (type === "image") {
        setSavedImages(data.hero.images);
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setSavedVideo(data.hero.videoUrl);
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 space-y-8">
        <h1 className="text-3xl font-bold">Hero Section Settings</h1>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "image" | "video")}
          className="w-full border rounded-lg p-3"
        >
          <option value="image">Images (Max 10)</option>
          <option value="video">Video</option>
        </select>

        <input
          type="file"
          ref={fileInputRef}
          accept={type === "image" ? "image/*" : "video/*"}
          multiple={type === "image"}
          onChange={handleFileChange}
          className="w-full border rounded-lg p-3"
        />

        {/* Saved Images */}
        {type === "image" && savedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {savedImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  className="rounded-lg object-cover h-40 w-full"
                />
                <button
                  onClick={() => removeSavedImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Images */}
        {type === "image" &&
          selectedFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="rounded-lg object-cover h-40 w-full"
              />
              <button
                onClick={() => removeNewImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                Remove
              </button>
            </div>
          ))}

        {/* Video */}
        {type === "video" && savedVideo && (
          <video src={savedVideo} controls className="rounded-lg w-full" />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Uploading..." : "Save Hero Settings"}
        </button>

        {message && <p className="text-green-600 font-medium">{message}</p>}
      </div>
    </div>
  );
}
