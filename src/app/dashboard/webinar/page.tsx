// "use client";

// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const API = process.env.NEXT_PUBLIC_API_BASE_URL;

// export default function AdminWebinarPage() {
//   const [webinar, setWebinar] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     date: "",
//     time: "",
//     durationMinutes: 60,
//     meetLink: "",
//     recordingLink: "",
//   });

//   /* ===================== */
//   /* FETCH ACTIVE WEBINAR */
//   /* ===================== */
//   const fetchWebinar = async () => {
//     try {
//       const res = await fetch(`${API}/api/webinars/active`);
//       if (!res.ok) return;
//       const data = await res.json();
//       setWebinar(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchWebinar();
//   }, []);

//   /* ===================== */
//   /* HANDLE CHANGE */
//   /* ===================== */
//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ===================== */
//   /* CREATE WEBINAR */
//   /* ===================== */
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Combine date + time
//       const combinedDateTime = new Date(`${form.date}T${form.time}`);

//       const payload = {
//         ...form,
//         date: combinedDateTime,
//       };

//       const res = await fetch(`${API}/api/webinars`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed");

//       toast.success("Webinar Created Successfully");

//       setForm({
//         title: "",
//         description: "",
//         date: "",
//         time: "",
//         durationMinutes: 60,
//         meetLink: "",
//         recordingLink: "",
//       });

//       fetchWebinar();
//     } catch (error) {
//       toast.error("Error creating webinar");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===================== */
//   /* DELETE WEBINAR */
//   /* ===================== */
//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`${API}/api/webinars/${id}`, {
//         method: "DELETE",
//       });

//       toast.success("Webinar Deleted");
//       setWebinar(null);
//     } catch (error) {
//       toast.error("Error deleting");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-black p-10">
//       <div className="max-w-4xl mx-auto">
//         {/* Heading */}
//         <h1 className="text-3xl font-semibold mb-10 text-center">
//           Manage Webinar
//         </h1>

//         {/* ===================== */}
//         {/* CREATE FORM */}
//         {/* ===================== */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm"
//         >
//           <h2 className="text-xl font-semibold mb-4">Create New Webinar</h2>

//           <input
//             type="text"
//             name="title"
//             placeholder="Webinar Title"
//             value={form.title}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           {/* Date Picker */}
//           <input
//             type="date"
//             name="date"
//             value={form.date}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           {/* Time Picker */}
//           <input
//             type="time"
//             name="time"
//             value={form.time}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <input
//             type="number"
//             name="durationMinutes"
//             placeholder="Duration (Minutes)"
//             value={form.durationMinutes}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <input
//             type="text"
//             name="meetLink"
//             placeholder="Google Meet Link"
//             value={form.meetLink}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <input
//             type="text"
//             name="recordingLink"
//             placeholder="Recording Link (Optional)"
//             value={form.recordingLink}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
//           >
//             {loading ? "Creating..." : "Create Webinar"}
//           </button>
//         </form>

//         {/* ===================== */}
//         {/* ACTIVE WEBINAR */}
//         {/* ===================== */}
//         {webinar && (
//           <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">
//               Current Active Webinar
//             </h2>

//             <p>
//               <strong>Title:</strong> {webinar.title}
//             </p>
//             <p>
//               <strong>Date:</strong> {new Date(webinar.date).toLocaleString()}
//             </p>
//             <p>
//               <strong>Status:</strong>
//               <span
//                 className={`ml-2 ${
//                   webinar.status === "live"
//                     ? "text-green-600"
//                     : webinar.status === "ended"
//                       ? "text-red-600"
//                       : "text-yellow-600"
//                 }`}
//               >
//                 {webinar.status}
//               </span>
//             </p>

//             <div className="mt-6">
//               <button
//                 onClick={() => handleDelete(webinar._id)}
//                 className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition"
//               >
//                 Delete Webinar
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }










"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminWebinarPage() {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    day: "",
    time: "",
    meetLink: "",
    recordingLink: "",
  });

  /* ===================== */
  /* FETCH ALL WEBINARS */
  /* ===================== */
  const fetchWebinars = async () => {
    try {
      const res = await fetch(`${API}/api/webinars`);
      if (!res.ok) return;
      const data = await res.json();
      setWebinars(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  /* ===================== */
  /* HANDLE CHANGE */
  /* ===================== */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===================== */
  /* CREATE WEBINAR */
  /* ===================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/webinars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Webinar Created Successfully");

      setForm({
        title: "",
        description: "",
        day: "",
        time: "",
        meetLink: "",
        recordingLink: "",
      });

      fetchWebinars();
    } catch (error) {
      toast.error("Error creating webinar");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== */
  /* DELETE WEBINAR */
  /* ===================== */
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/api/webinars/${id}`, {
        method: "DELETE",
      });

      toast.success("Webinar Deleted");
      fetchWebinars();
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10 text-center">
          Manage Webinars
        </h1>

        {/* ===================== */}
        {/* CREATE FORM */}
        {/* ===================== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">
            Create New Webinar
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Webinar Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          {/* Day */}
          <select
            name="day"
            value={form.day}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Day</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>

          {/* Time */}
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="text"
            name="meetLink"
            placeholder="Google Meet Link"
            value={form.meetLink}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="text"
            name="recordingLink"
            placeholder="Recording Link (Optional)"
            value={form.recordingLink}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            {loading ? "Creating..." : "Create Webinar"}
          </button>
        </form>

        {/* ===================== */}
        {/* WEBINAR LIST */}
        {/* ===================== */}
        <div className="mt-12 space-y-6">
          {webinars.map((webinar) => (
            <div
              key={webinar._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <p><strong>Title:</strong> {webinar.title}</p>
              <p><strong>Day:</strong> {webinar.day}</p>
              <p><strong>Time:</strong> {webinar.time}</p>

              <div className="mt-4">
                <button
                  onClick={() => handleDelete(webinar._id)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}