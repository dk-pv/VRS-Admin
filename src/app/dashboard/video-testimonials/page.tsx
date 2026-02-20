// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";

// interface VideoTestimonial {
//   _id: string;
//   name: string;
//   role: string;
//   thumbnail: string;
//   youtubeLink: string;
// }

// export default function AdminVideoTestimonials() {
//   const API = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const [videos, setVideos] = useState<VideoTestimonial[]>([]);
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("");
//   const [youtubeLink, setYoutubeLink] = useState("");
//   const [thumbnailFile, setThumbnailFile] =
//     useState<File | null>(null);
//   const [editing, setEditing] =
//     useState<VideoTestimonial | null>(null);

//   const fileRef = useRef<HTMLInputElement>(null);

//   const fetchVideos = async () => {
//     const res = await axios.get(
//       `${API}/api/video-testimonials`
//     );
//     setVideos(res.data);
//   };

//   useEffect(() => {
//     if (API) fetchVideos();
//   }, [API]);

//   const resetForm = () => {
//     setName("");
//     setRole("");
//     setYoutubeLink("");
//     setThumbnailFile(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const addVideo = async () => {
//     if (!name || !role || !youtubeLink || !thumbnailFile)
//       return;

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("role", role);
//     formData.append("youtubeLink", youtubeLink);
//     formData.append("thumbnail", thumbnailFile);

//     await axios.post(
//       `${API}/api/video-testimonials`,
//       formData
//     );

//     resetForm();
//     fetchVideos();
//   };

//   const deleteVideo = async (id: string) => {
//     await axios.delete(
//       `${API}/api/video-testimonials/${id}`
//     );
//     setVideos((prev) =>
//       prev.filter((v) => v._id !== id)
//     );
//   };

//   const updateVideo = async () => {
//     if (!editing) return;

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("role", role);
//     formData.append("youtubeLink", youtubeLink);

//     if (thumbnailFile) {
//       formData.append("thumbnail", thumbnailFile);
//     }

//     await axios.put(
//       `${API}/api/video-testimonials/${editing._id}`,
//       formData
//     );

//     setEditing(null);
//     resetForm();
//     fetchVideos();
//   };

//   return (
//     <div className="p-10 bg-gray-100 min-h-screen">
//       <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
//         <h1 className="text-2xl font-bold mb-6">
//           Video Testimonials
//         </h1>

//         {/* ADD FORM */}
//         <div className="grid md:grid-cols-4 gap-4 mb-8">
//           <input
//             placeholder="Client Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="border p-3 rounded-lg"
//           />

//           <input
//             placeholder="Role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="border p-3 rounded-lg"
//           />

//           <input
//             placeholder="YouTube Link"
//             value={youtubeLink}
//             onChange={(e) =>
//               setYoutubeLink(e.target.value)
//             }
//             className="border p-3 rounded-lg"
//           />

//           <input
//             type="file"
//             ref={fileRef}
//             accept="image/*"
//             onChange={(e) =>
//               e.target.files &&
//               setThumbnailFile(e.target.files[0])
//             }
//             className="border p-3 rounded-lg"
//           />

//           <button
//             onClick={addVideo}
//             className="bg-black text-white rounded-lg"
//           >
//             Add
//           </button>
//         </div>

//         {/* LIST */}
//         <div className="space-y-4">
//           {videos.map((video) => (
//             <div
//               key={video._id}
//               className="flex justify-between items-center border p-4 rounded-lg"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={video.thumbnail}
//                   className="w-16 h-16 object-cover rounded"
//                 />
//                 <div>
//                   <p className="font-semibold">
//                     {video.name}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {video.role}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <button
//                   onClick={() => {
//                     setEditing(video);
//                     setName(video.name);
//                     setRole(video.role);
//                     setYoutubeLink(video.youtubeLink);
//                   }}
//                   className="text-blue-600"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() =>
//                     deleteVideo(video._id)
//                   }
//                   className="text-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* EDIT MODAL */}
//         {editing && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg w-[450px]">
//               <h2 className="text-lg font-semibold mb-4">
//                 Update Video Testimonial
//               </h2>

//               <input
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="border p-2 w-full mb-3"
//               />

//               <input
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="border p-2 w-full mb-3"
//               />

//               <input
//                 value={youtubeLink}
//                 onChange={(e) =>
//                   setYoutubeLink(e.target.value)
//                 }
//                 className="border p-2 w-full mb-3"
//               />

//               <input
//                 type="file"
//                 onChange={(e) =>
//                   e.target.files &&
//                   setThumbnailFile(e.target.files[0])
//                 }
//                 className="mb-4"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setEditing(null);
//                     resetForm();
//                   }}
//                   className="border px-4 py-2"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={updateVideo}
//                   className="bg-black text-white px-4 py-2"
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<VideoTestimonial | null>(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API}/api/video-testimonials`);
      setVideos(res.data);
    } catch {
      toast.error("Failed to load videos");
    }
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
    if (loading) return;

    if (!name || !role || !youtubeLink || !thumbnailFile) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      formData.append("youtubeLink", youtubeLink);
      formData.append("thumbnail", thumbnailFile);

      await axios.post(`${API}/api/video-testimonials`, formData);

      toast.success("Video testimonial added");

      resetForm();
      fetchVideos();
    } catch {
      toast.error("Failed to add video testimonial");
    }

    setLoading(false);
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video testimonial?")) return;

    try {
      await axios.delete(`${API}/api/video-testimonials/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateVideo = async () => {
    if (!editing || loading) return;

    try {
      setLoading(true);

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

      toast.success("Updated successfully");

      setEditing(null);
      resetForm();
      fetchVideos();
    } catch {
      toast.error("Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-10">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Video Testimonials
          </h1>
          <p className="text-gray-500 mt-2">
            Manage client video reviews
          </p>
        </div>

        {/* ADD FORM */}
        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-xl p-4"
          />

          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-xl p-4"
          />

          <input
            placeholder="YouTube Link"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-xl p-4"
          />

          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) =>
              e.target.files && setThumbnailFile(e.target.files[0])
            }
            className="border border-dashed border-gray-400 rounded-xl p-4"
          />

          <button
            onClick={addVideo}
            disabled={loading}
            className={`rounded-xl text-white font-semibold ${
              loading ? "bg-gray-500" : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-2xl shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <img
                  src={video.thumbnail}
                  className="w-20 h-16 object-cover rounded-xl shadow-md"
                />
                <div>
                  <p className="font-semibold text-lg">{video.name}</p>
                  <p className="text-sm text-gray-500">{video.role}</p>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteVideo(video._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[450px] shadow-2xl space-y-6">

            <h2 className="text-2xl font-semibold">
              Update Video Testimonial
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-xl p-4 w-full"
            />

            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded-xl p-4 w-full"
            />

            <input
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="border border-gray-300 rounded-xl p-4 w-full"
            />

            <input
              type="file"
              onChange={(e) =>
                e.target.files && setThumbnailFile(e.target.files[0])
              }
              className="border border-dashed border-gray-400 rounded-xl p-4 w-full"
            />

            {thumbnailFile && (
              <img
                src={URL.createObjectURL(thumbnailFile)}
                className="h-40 rounded-xl object-cover shadow-md"
              />
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditing(null);
                  resetForm();
                }}
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={updateVideo}
                disabled={loading}
                className={`px-5 py-2 rounded-xl text-white ${
                  loading ? "bg-gray-500" : "bg-black hover:bg-gray-900"
                }`}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}