"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
}

export default function AdminTeamPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch team
  const fetchTeam = async () => {
    const res = await axios.get(`${API}/api/team`);
    setMembers(res.data);
  };

  useEffect(() => {
    if (API) fetchTeam();
  }, [API]);

  // Reset form
  const resetForm = () => {
    setName("");
    setRole("");
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ADD MEMBER
  const addMember = async () => {
    if (!name || !role || !imageFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("image", imageFile);

    await axios.post(`${API}/api/team`, formData);

    resetForm();
    fetchTeam();
    setLoading(false);
  };

  // DELETE
  const deleteMember = async (id: string) => {
    await axios.delete(`${API}/api/team/${id}`);
    setMembers((prev) => prev.filter((m) => m._id !== id));
  };

  // UPDATE
  const updateMember = async () => {
    if (!editing) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await axios.put(
      `${API}/api/team/${editing._id}`,
      formData
    );

    setEditing(null);
    resetForm();
    fetchTeam();
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          Team Members
        </h1>

        {/* ADD FORM */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <input
            placeholder="Name"
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
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              setImageFile(e.target.files[0])
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={addMember}
            disabled={loading}
            className="bg-black text-white rounded-lg"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>

        {/* TEAM LIST */}
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.image}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditing(member);
                    setName(member.name);
                    setRole(member.role);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteMember(member._id)
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
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              Update Member
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
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                setImageFile(e.target.files[0])
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
                onClick={updateMember}
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
