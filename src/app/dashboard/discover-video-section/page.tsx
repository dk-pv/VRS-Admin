"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function AdminDiscoverVideo() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [savedThumbnail, setSavedThumbnail] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/discover-video`);
    if (res.data) {
      setVideoUrl(res.data.videoUrl);
      setSavedThumbnail(res.data.thumbnail);
    }
  };

  useEffect(() => {
    if (API) fetchData();
  }, [API]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("videoUrl", videoUrl);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    await axios.put(`${API}/api/discover-video`, formData);

    if (fileRef.current) fileRef.current.value = "";
    setThumbnailFile(null);

    fetchData();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Discover Video Settings
      </h1>

      <input
        type="text"
        placeholder="YouTube Link"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="border p-3 w-full mb-4"
      />

      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        onChange={(e) =>
          e.target.files && setThumbnailFile(e.target.files[0])
        }
        className="mb-4"
      />

      {savedThumbnail && (
        <img
          src={savedThumbnail}
          className="h-40 mb-4 rounded"
        />
      )}

      <button
        onClick={handleSave}
        className="bg-black text-white px-6 py-2"
      >
        Save
      </button>
    </div>
  );
}
