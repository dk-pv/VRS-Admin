"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/secured-properties`);
    setProperties(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ADD
  const addProperty = async () => {
    if (!title || !imageFile) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageFile);

    await axios.post(`${API}/api/secured-properties`, formData);

    setTitle("");
    setImageFile(null);
    fetchData();
  };

  // DELETE
  const deleteProperty = async (id: string) => {
    await axios.delete(`${API}/api/secured-properties/${id}`);
    setProperties(properties.filter((p) => p._id !== id));
  };

  // UPDATE
  const updateProperty = async () => {
    if (!editing) return;

    const formData = new FormData();
    formData.append("title", title);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await axios.put(`${API}/api/secured-properties/${editing._id}`, formData);

    setEditing(null);
    setTitle("");
    setImageFile(null);
    fetchData();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Secured Properties (Todo Style)
      </h1>

      {/* Add Section */}
      <div className="flex gap-4 mb-8">
        <input
          placeholder="Property Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
        />

        <button onClick={addProperty} className="bg-black text-white px-4 py-2">
          Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property._id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div className="flex items-center gap-4">
              <img
                src={property.image}
                className="w-16 h-14 object-cover rounded"
              />
              <p>{property.title}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(property);
                  setTitle(property.title);
                }}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProperty(property._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Update Property</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full mb-4"
            />

            <input
              type="file"
              onChange={(e) =>
                e.target.files && setImageFile(e.target.files[0])
              }
              className="mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border"
              >
                Cancel
              </button>

              <button
                onClick={updateProperty}
                className="px-4 py-2 bg-black text-white"
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
