// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// interface Testimonial {
//   _id: string;
//   name: string;
//   location: string;
//   text: string;
//   rating: number;
// }

// export default function AdminTextTestimonials() {
//   const API = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState("");
//   const [text, setText] = useState("");
//   const [rating, setRating] = useState(5);
//   const [editing, setEditing] = useState<Testimonial | null>(null);

//   // Fetch testimonials
//   const fetchTestimonials = async () => {
//     const res = await axios.get(`${API}/api/text-testimonials`);
//     setTestimonials(res.data);
//   };

//   useEffect(() => {
//     if (API) fetchTestimonials();
//   }, [API]);

//   const resetForm = () => {
//     setName("");
//     setLocation("");
//     setText("");
//     setRating(5);
//   };

//   // ADD
//   const addTestimonial = async () => {
//     if (!name || !location || !text) return;

//     await axios.post(`${API}/api/text-testimonials`, {
//       name,
//       location,
//       text,
//       rating,
//     });

//     resetForm();
//     fetchTestimonials();
//   };

//   // DELETE
//   const deleteTestimonial = async (id: string) => {
//     await axios.delete(`${API}/api/text-testimonials/${id}`);
//     setTestimonials((prev) =>
//       prev.filter((t) => t._id !== id)
//     );
//   };

//   // UPDATE
//   const updateTestimonial = async () => {
//     if (!editing) return;

//     await axios.put(
//       `${API}/api/text-testimonials/${editing._id}`,
//       {
//         name,
//         location,
//         text,
//         rating,
//       }
//     );

//     setEditing(null);
//     resetForm();
//     fetchTestimonials();
//   };

//   return (
//     <div className="p-10 bg-gray-100 min-h-screen">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
//         <h1 className="text-2xl font-bold mb-6">
//           Text Testimonials
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
//             placeholder="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             className="border p-3 rounded-lg"
//           />

//           <select
//             value={rating}
//             onChange={(e) =>
//               setRating(Number(e.target.value))
//             }
//             className="border p-3 rounded-lg"
//           >
//             {[5, 4, 3, 2, 1].map((r) => (
//               <option key={r} value={r}>
//                 {r} Stars
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={addTestimonial}
//             className="bg-black text-white rounded-lg"
//           >
//             Add
//           </button>
//         </div>

//         <textarea
//           placeholder="Client Review"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="border p-3 rounded-lg w-full mb-8"
//           rows={3}
//         />

//         {/* LIST */}
//         <div className="space-y-4">
//           {testimonials.map((testimonial) => (
//             <div
//               key={testimonial._id}
//               className="border p-4 rounded-lg flex justify-between items-start"
//             >
//               <div>
//                 <p className="font-semibold">
//                   {testimonial.name}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {testimonial.location}
//                 </p>
//                 <p className="mt-2 text-gray-700">
//                   {testimonial.text}
//                 </p>
//                 <p className="mt-1 text-yellow-600 text-sm">
//                   ⭐ {testimonial.rating} Stars
//                 </p>
//               </div>

//               <div className="flex gap-4">
//                 <button
//                   onClick={() => {
//                     setEditing(testimonial);
//                     setName(testimonial.name);
//                     setLocation(testimonial.location);
//                     setText(testimonial.text);
//                     setRating(testimonial.rating);
//                   }}
//                   className="text-blue-600"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() =>
//                     deleteTestimonial(testimonial._id)
//                   }
//                   className="text-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* EDIT MODAL */}
//       {editing && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-[450px]">
//             <h2 className="text-lg font-semibold mb-4">
//               Update Testimonial
//             </h2>

//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border p-2 w-full mb-3"
//             />

//             <input
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="border p-2 w-full mb-3"
//             />

//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="border p-2 w-full mb-3"
//               rows={3}
//             />

//             <select
//               value={rating}
//               onChange={(e) =>
//                 setRating(Number(e.target.value))
//               }
//               className="border p-2 w-full mb-4"
//             >
//               {[5, 4, 3, 2, 1].map((r) => (
//                 <option key={r} value={r}>
//                   {r} Stars
//                 </option>
//               ))}
//             </select>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setEditing(null);
//                   resetForm();
//                 }}
//                 className="border px-4 py-2"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={updateTestimonial}
//                 className="bg-black text-white px-4 py-2"
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

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Testimonial {
  _id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export default function AdminTextTestimonials() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/api/text-testimonials`);
      setTestimonials(res.data);
    } catch {
      toast.error("Failed to load testimonials");
    }
  };

  useEffect(() => {
    if (API) fetchTestimonials();
  }, [API]);

  const resetForm = () => {
    setName("");
    setLocation("");
    setText("");
    setRating(5);
  };

  // ADD
  const addTestimonial = async () => {
    if (loading) return;

    if (!name || !location || !text) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/api/text-testimonials`, {
        name,
        location,
        text,
        rating,
      });

      toast.success("Testimonial added");

      resetForm();
      fetchTestimonials();
    } catch {
      toast.error("Failed to add testimonial");
    }

    setLoading(false);
  };

  // DELETE
  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await axios.delete(`${API}/api/text-testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  // UPDATE
  const updateTestimonial = async () => {
    if (!editing || loading) return;

    try {
      setLoading(true);

      await axios.put(`${API}/api/text-testimonials/${editing._id}`, {
        name,
        location,
        text,
        rating,
      });

      toast.success("Updated successfully");

      setEditing(null);
      resetForm();
      fetchTestimonials();
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
            client testimonials.{" "}
          </h1>
          <p className="text-gray-500 mt-2">Manage client reviews</p>
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
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-xl p-4"
          />

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border border-gray-300 rounded-xl p-4"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>

          <button
            onClick={addTestimonial}
            disabled={loading}
            className={`rounded-xl text-white font-semibold ${
              loading ? "bg-gray-500" : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        <textarea
          placeholder="Client Review"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-xl p-4 w-full"
          rows={4}
        />

        {/* LIST */}
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-2xl shadow-sm flex justify-between"
            >
              <div>
                <p className="font-semibold text-lg">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
                <p className="mt-3 text-gray-700">{testimonial.text}</p>
                <div className="mt-2 text-yellow-500">
                  {"⭐".repeat(testimonial.rating)}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditing(testimonial);
                    setName(testimonial.name);
                    setLocation(testimonial.location);
                    setText(testimonial.text);
                    setRating(testimonial.rating);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTestimonial(testimonial._id)}
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
            <h2 className="text-2xl font-semibold">Update Testimonial</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-xl p-4 w-full"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 rounded-xl p-4 w-full"
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-300 rounded-xl p-4 w-full"
              rows={4}
            />

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-xl p-4 w-full"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>

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
                onClick={updateTestimonial}
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
