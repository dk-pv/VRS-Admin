// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";

// export default function AdminPropertyShowcase() {
//   const API = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const [savedImages, setSavedImages] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch existing images
//   const fetchShowcase = async () => {
//     const res = await axios.get(`${API}/api/property-showcase`);
//     setSavedImages(res.data.images || []);
//   };

//   useEffect(() => {
//     if (API) fetchShowcase();
//   }, [API]);

//   // Handle file select
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     setSelectedFiles((prev) => [...prev, ...files]);
//   };

//   // Remove selected (before upload)
//   const removeSelected = (index: number) => {
//     setSelectedFiles((prev) =>
//       prev.filter((_, i) => i !== index)
//     );
//   };

//   // Upload images
//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       setMessage("Please select images");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     const formData = new FormData();
//     selectedFiles.forEach((file) =>
//       formData.append("images", file)
//     );

//     await axios.put(
//       `${API}/api/property-showcase`,
//       formData
//     );

//     setSelectedFiles([]);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     fetchShowcase();
//     setLoading(false);
//     setMessage("Images uploaded successfully ✅");
//   };

//   // Remove saved image
//   const removeSavedImage = async (index: number) => {
//     const updatedImages = savedImages.filter(
//       (_, i) => i !== index
//     );

//     setSavedImages(updatedImages);

//     await axios.put(`${API}/api/property-showcase/remove`, {
//       images: updatedImages,
//     });
//   };

//   return (
//     <div className="p-10 bg-gray-100 min-h-screen">
//       <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
//         <h1 className="text-2xl font-bold mb-6">
//           Property Showcase Settings
//         </h1>

//         {/* Upload Section */}
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="w-full border p-3 rounded-lg mb-4"
//         />

//         {selectedFiles.length > 0 && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {selectedFiles.map((file, index) => (
//               <div key={index} className="relative">
//                 <img
//                   src={URL.createObjectURL(file)}
//                   className="h-32 w-full object-cover rounded-lg"
//                 />
//                 <button
//                   onClick={() => removeSelected(index)}
//                   className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className="bg-black text-white px-6 py-2 rounded-lg"
//         >
//           {loading ? "Uploading..." : "Upload Images"}
//         </button>

//         {message && (
//           <p className="mt-4 text-green-600 font-medium">
//             {message}
//           </p>
//         )}

//         {/* Saved Images */}
//         {savedImages.length > 0 && (
//           <>
//             <h2 className="text-xl font-semibold mt-10 mb-4">
//               Saved Images
//             </h2>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {savedImages.map((img, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={img}
//                     className="h-32 w-full object-cover rounded-lg"
//                   />
//                   <button
//                     onClick={() => removeSavedImage(index)}
//                     className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPropertyShowcase() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing images
  const fetchShowcase = async () => {
    try {
      const res = await axios.get(`${API}/api/property-showcase`);
      setSavedImages(res.data.images || []);
    } catch {
      toast.error("Failed to load showcase images");
    }
  };

  useEffect(() => {
    if (API) fetchShowcase();
  }, [API]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Remove selected (before upload)
  const removeSelected = (index: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // Upload images
  const handleUpload = async () => {
    if (loading) return;

    if (selectedFiles.length === 0) {
      toast.error("Please select images");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      selectedFiles.forEach((file) =>
        formData.append("images", file)
      );

      await axios.put(
        `${API}/api/property-showcase`,
        formData
      );

      toast.success("Images uploaded successfully");

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchShowcase();
    } catch {
      toast.error("Upload failed");
    }

    setLoading(false);
  };

  // Remove saved image
  const removeSavedImage = async (index: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const updatedImages = savedImages.filter(
        (_, i) => i !== index
      );

      setSavedImages(updatedImages);

      await axios.put(`${API}/api/property-showcase/remove`, {
        images: updatedImages,
      });

      toast.success("Image deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-10">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Property Showcase Settings
          </h1>
          <p className="text-gray-500 mt-2">
            Manage showcase gallery images
          </p>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full border border-dashed border-gray-400 rounded-xl p-6 cursor-pointer hover:border-black transition"
          />

          {selectedFiles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Selected Images
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      className="h-40 w-full object-cover rounded-xl shadow-md"
                    />
                    <button
                      onClick={() => removeSelected(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Uploading..." : "Upload Images"}
          </button>
        </div>

        {/* Saved Images */}
        {savedImages.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Saved Images
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {savedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    className="h-40 w-full object-cover rounded-xl shadow-md"
                  />
                  <button
                    onClick={() => removeSavedImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}