"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminWebinarPage() {
  const [webinar, setWebinar] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    durationMinutes: 60,
    meetLink: "",
    recordingLink: "",
  });

  /* ===================== */
  /* FETCH ACTIVE WEBINAR */
  /* ===================== */
  const fetchWebinar = async () => {
    try {
      const res = await fetch(`${API}/api/webinars/active`);
      if (!res.ok) return;
      const data = await res.json();
      setWebinar(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWebinar();
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
        date: "",
        durationMinutes: 60,
        meetLink: "",
        recordingLink: "",
      });

      fetchWebinar();
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
      setWebinar(null);
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-semibold mb-10 text-center">
          Manage Webinar
        </h1>

        {/* ===================== */}
        {/* CREATE FORM */}
        {/* ===================== */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#0b1320] border border-white/10 rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-xl font-semibold mb-4">Create New Webinar</h2>

          <input
            type="text"
            name="title"
            placeholder="Webinar Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/20 p-3 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 p-3 rounded-lg"
          />

          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/20 p-3 rounded-lg"
          />

          <input
            type="number"
            name="durationMinutes"
            placeholder="Duration (Minutes)"
            value={form.durationMinutes}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 p-3 rounded-lg"
          />

          <input
            type="text"
            name="meetLink"
            placeholder="Google Meet Link"
            value={form.meetLink}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/20 p-3 rounded-lg"
          />

          <input
            type="text"
            name="recordingLink"
            placeholder="Recording Link (Optional)"
            value={form.recordingLink}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 p-3 rounded-lg"
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
        {/* ACTIVE WEBINAR */}
        {/* ===================== */}
        {webinar && (
          <div className="mt-12 bg-[#0b1320] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-4">
              Current Active Webinar
            </h2>

            <p><strong>Title:</strong> {webinar.title}</p>
            <p><strong>Date:</strong> {new Date(webinar.date).toLocaleString()}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 ${
                webinar.status === "live"
                  ? "text-green-400"
                  : webinar.status === "ended"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}>
                {webinar.status}
              </span>
            </p>

            <div className="mt-6">
              <button
                onClick={() => handleDelete(webinar._id)}
                className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-500 transition"
              >
                Delete Webinar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}