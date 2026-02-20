// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRef } from "react";

// interface Property {
//   _id: string;
//   title: string;
//   image: string;
// }

// export default function AdminSecuredProperties() {
//   const API = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const [properties, setProperties] = useState<Property[]>([]);
//   const [title, setTitle] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [editing, setEditing] = useState<Property | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const fetchData = async () => {
//     const res = await axios.get(`${API}/api/secured-properties`);
//     setProperties(res.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ADD
//   const addProperty = async () => {
//     if (!title || !imageFile) return;

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("image", imageFile);

//     await axios.post(`${API}/api/secured-properties`, formData);

//     setTitle("");
//     setImageFile(null);
//     fetchData();
//   };

//   // DELETE
//   const deleteProperty = async (id: string) => {
//     await axios.delete(`${API}/api/secured-properties/${id}`);
//     setProperties(properties.filter((p) => p._id !== id));
//   };

//   // UPDATE
//   const updateProperty = async () => {
//     if (!editing) return;

//     const formData = new FormData();
//     formData.append("title", title);
//     if (imageFile) {
//       formData.append("image", imageFile);
//     }

//     await axios.put(`${API}/api/secured-properties/${editing._id}`, formData);

//     setEditing(null);
//     setTitle("");
//     setImageFile(null);
//     fetchData();
//   };

//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-semibold mb-6">
//         Secured Properties (Todo Style)
//       </h1>

//       {/* Add Section */}
//       <div className="flex gap-4 mb-8">
//         <input
//           placeholder="Property Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="border p-2"
//         />
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
//         />

//         <button onClick={addProperty} className="bg-black text-white px-4 py-2">
//           Add
//         </button>
//       </div>

//       {/* List */}
//       <div className="space-y-4">
//         {properties.map((property) => (
//           <div
//             key={property._id}
//             className="flex justify-between items-center border p-4 rounded"
//           >
//             <div className="flex items-center gap-4">
//               <img
//                 src={property.image}
//                 className="w-16 h-14 object-cover rounded"
//               />
//               <p>{property.title}</p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setEditing(property);
//                   setTitle(property.title);
//                 }}
//                 className="text-blue-600"
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => deleteProperty(property._id)}
//                 className="text-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {editing && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded w-[400px]">
//             <h2 className="text-lg font-semibold mb-4">Update Property</h2>

//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="border p-2 w-full mb-4"
//             />

//             <input
//               type="file"
//               onChange={(e) =>
//                 e.target.files && setImageFile(e.target.files[0])
//               }
//               className="mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setEditing(null)}
//                 className="px-4 py-2 border"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={updateProperty}
//                 className="px-4 py-2 bg-black text-white"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Property {
  _id: string;
  title: string;
  image: string;
}

export default function AdminSecuredProperties() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [properties, setProperties] = useState<Property[]>([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/secured-properties`);
      setProperties(res.data);
    } catch {
      toast.error("Failed to load properties");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ADD
  const addProperty = async () => {
    if (loading) return;

    if (!title || !imageFile) {
      toast.error("Please enter title and image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", imageFile);

      await axios.post(`${API}/api/secured-properties`, formData);

      toast.success("Property added successfully");

      resetForm();
      fetchData();
    } catch {
      toast.error("Failed to add property");
    }

    setLoading(false);
  };

  // DELETE
  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await axios.delete(`${API}/api/secured-properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // UPDATE
  const updateProperty = async () => {
    if (!editing || loading) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(
        `${API}/api/secured-properties/${editing._id}`,
        formData
      );

      toast.success("Property updated");

      setEditing(null);
      resetForm();
      fetchData();
    } catch {
      toast.error("Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10 space-y-10 border border-gray-100">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Secured Properties
          </h1>
          <p className="text-gray-500 mt-2">
            Manage secured property listings
          </p>
        </div>

        {/* Add Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-xl p-4 transition-all"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) =>
              e.target.files && setImageFile(e.target.files[0])
            }
            className="border border-dashed border-gray-400 rounded-xl p-4 cursor-pointer hover:border-black transition"
          />

          <button
            onClick={addProperty}
            disabled={loading}
            className={`rounded-xl text-white font-semibold py-4 transition-all ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Adding..." : "Add Property"}
          </button>
        </div>

        {/* List */}
        <div className="space-y-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition p-6 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-6">
                <img
                  src={property.image}
                  className="w-20 h-16 object-cover rounded-xl shadow-md"
                />
                <p className="font-semibold text-lg">
                  {property.title}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditing(property);
                    setTitle(property.title);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProperty(property._id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[420px] shadow-2xl space-y-6">

            <h2 className="text-2xl font-semibold">
              Update Property
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-xl p-4 w-full"
            />

            <input
              type="file"
              onChange={(e) =>
                e.target.files && setImageFile(e.target.files[0])
              }
              className="border border-dashed border-gray-400 rounded-xl p-4 w-full"
            />

            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                className="h-40 rounded-xl shadow-md object-cover"
              />
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={updateProperty}
                disabled={loading}
                className={`px-5 py-2 rounded-xl text-white ${
                  loading
                    ? "bg-gray-500"
                    : "bg-black hover:bg-gray-900"
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