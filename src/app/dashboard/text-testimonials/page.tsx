"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch testimonials
  const fetchTestimonials = async () => {
    const res = await axios.get(`${API}/api/text-testimonials`);
    setTestimonials(res.data);
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
    if (!name || !location || !text) return;

    await axios.post(`${API}/api/text-testimonials`, {
      name,
      location,
      text,
      rating,
    });

    resetForm();
    fetchTestimonials();
  };

  // DELETE
  const deleteTestimonial = async (id: string) => {
    await axios.delete(`${API}/api/text-testimonials/${id}`);
    setTestimonials((prev) =>
      prev.filter((t) => t._id !== id)
    );
  };

  // UPDATE
  const updateTestimonial = async () => {
    if (!editing) return;

    await axios.put(
      `${API}/api/text-testimonials/${editing._id}`,
      {
        name,
        location,
        text,
        rating,
      }
    );

    setEditing(null);
    resetForm();
    fetchTestimonials();
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          Text Testimonials
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
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
            className="border p-3 rounded-lg"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>

          <button
            onClick={addTestimonial}
            className="bg-black text-white rounded-lg"
          >
            Add
          </button>
        </div>

        <textarea
          placeholder="Client Review"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-3 rounded-lg w-full mb-8"
          rows={3}
        />

        {/* LIST */}
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="border p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-500">
                  {testimonial.location}
                </p>
                <p className="mt-2 text-gray-700">
                  {testimonial.text}
                </p>
                <p className="mt-1 text-yellow-600 text-sm">
                  ⭐ {testimonial.rating} Stars
                </p>
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
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteTestimonial(testimonial._id)
                  }
                  className="text-red-600"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[450px]">
            <h2 className="text-lg font-semibold mb-4">
              Update Testimonial
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border p-2 w-full mb-3"
              rows={3}
            />

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              className="border p-2 w-full mb-4"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>

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
                onClick={updateTestimonial}
                className="bg-black text-white px-4 py-2"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
