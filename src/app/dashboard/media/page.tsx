"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

interface ImageItem {
  _id: string;
  url: string;
  public_id: string;
}

interface HeroData {
  type: "image" | "video";
  images: ImageItem[];
  video?: {
    url: string;
    public_id: string;
  };
}

export default function HeroMedia() {
  const [type, setType] = useState<"image" | "video">("image");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<ImageItem[]>([]);
  const [savedVideo, setSavedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ================= FETCH HERO =================
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hero`);
        const data: HeroData = await res.json();

        setType(data.type);
        setSavedImages(data.images || []);
        setSavedVideo(data.video?.url || null);
      } catch {
        toast.error("Failed to load hero");
      }
    };

    if (API_BASE_URL) fetchHero();
  }, [API_BASE_URL]);

  // ================= FILE SELECT =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    if (type === "image") {
      const total = savedImages.length + selectedFiles.length + newFiles.length;

      if (total > 10) {
        toast.error("Max 10 images allowed");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    } else {
      setSelectedFiles([newFiles[0]]);
    }
  };

  // ================= REMOVE NEW =================
  const removeNewImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= DELETE SAVED =================
  const removeSavedImage = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_BASE_URL}/api/hero/image/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Delete failed");
        return;
      }

      setSavedImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Error deleting image");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (loading) return;

    if (type === "image" && selectedFiles.length === 0) {
      toast.error("No new images selected");
      return;
    }

    if (type === "video" && !selectedFiles[0]) {
      toast.error("No video selected");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("type", type);

    if (type === "image") {
      selectedFiles.forEach((file) => formData.append("images", file));
    } else {
      formData.append("video", selectedFiles[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/hero`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Upload failed");
      } else {
        toast.success("Updated successfully");

        if (type === "image") {
          setSavedImages(data.hero.images);
        } else {
          setSavedVideo(data.hero.video.url);
        }

        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-10 space-y-10">

        <h1 className="text-3xl font-bold">Hero Media</h1>

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "image" | "video")}
          className="w-full p-3 border rounded-xl"
        >
          <option value="image">Images (Max 10)</option>
          <option value="video">Video</option>
        </select>

        {/* UPLOAD */}
        <input
          type="file"
          ref={fileInputRef}
          accept={type === "image" ? "image/*" : "video/*"}
          multiple={type === "image"}
          onChange={handleFileChange}
          className="w-full border p-4 rounded-xl"
        />

        {/* SAVED IMAGES */}
        {type === "image" && savedImages.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3">Saved Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {savedImages.map((img) => (
                <div key={img._id} className="relative group">
                  <img src={img.url} className="h-40 w-full object-cover rounded-xl" />
                  <button
                    onClick={() => removeSavedImage(img._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEW IMAGES */}
        {type === "image" && selectedFiles.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3">New Uploads</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedFiles.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="relative group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    className="h-40 w-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeNewImage(selectedFiles.indexOf(file))}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO */}
        {type === "video" && savedVideo && (
          <video src={savedVideo} controls className="w-full rounded-xl" />
        )}

        {/* NEW VIDEO PREVIEW */}
        {type === "video" && selectedFiles[0] && (
          <video
            src={URL.createObjectURL(selectedFiles[0])}
            controls
            className="w-full rounded-xl"
          />
        )}

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl"
        >
          {loading ? "Uploading..." : "Save"}
        </button>
      </div>
    </div>
  );
}