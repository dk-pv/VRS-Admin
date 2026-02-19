"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface VideoTestimonial {
  _id: string;
  name: string;
  role: string;
  thumbnail: string;
  youtubeLink: string;
}

export default function AdminVideoTestimonials() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [videos, setVideos] = useState<VideoTestimonial[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);
  const [editing, setEditing] =
    useState<VideoTestimonial | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVideos = async () => {
    const res = await axios.get(
      `${API}/api/video-testimonials`
    );
    setVideos(res.data);
  };

  useEffect(() => {
    if (API) fetchVideos();
  }, [API]);

  const resetForm = () => {
    setName("");
    setRole("");
    setYoutubeLink("");
    setThumbnailFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addVideo = async () => {
    if (!name || !role || !youtubeLink || !thumbnailFile)
      return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("youtubeLink", youtubeLink);
    formData.append("thumbnail", thumbnailFile);

    await axios.post(
      `${API}/api/video-testimonials`,
      formData
    );

    resetForm();
    fetchVideos();
  };

  const deleteVideo = async (id: string) => {
    await axios.delete(
      `${API}/api/video-testimonials/${id}`
    );
    setVideos((prev) =>
      prev.filter((v) => v._id !== id)
    );
  };

  const updateVideo = async () => {
    if (!editing) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("youtubeLink", youtubeLink);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    await axios.put(
      `${API}/api/video-testimonials/${editing._id}`,
      formData
    );

    setEditing(null);
    resetForm();
    fetchVideos();
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">
          Video Testimonials
        </h1>

        {/* ADD FORM */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <input
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="YouTube Link"
            value={youtubeLink}
            onChange={(e) =>
              setYoutubeLink(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              setThumbnailFile(e.target.files[0])
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={addVideo}
            className="bg-black text-white rounded-lg"
          >
            Add
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video._id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={video.thumbnail}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">
                    {video.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {video.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditing(video);
                    setName(video.name);
                    setRole(video.role);
                    setYoutubeLink(video.youtubeLink);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteVideo(video._id)
                  }
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EDIT MODAL */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[450px]">
              <h2 className="text-lg font-semibold mb-4">
                Update Video Testimonial
              </h2>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full mb-3"
              />

              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 w-full mb-3"
              />

              <input
                value={youtubeLink}
                onChange={(e) =>
                  setYoutubeLink(e.target.value)
                }
                className="border p-2 w-full mb-3"
              />

              <input
                type="file"
                onChange={(e) =>
                  e.target.files &&
                  setThumbnailFile(e.target.files[0])
                }
                className="mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditing(null);
                    resetForm();
                  }}
                  className="border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={updateVideo}
                  className="bg-black text-white px-4 py-2"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
