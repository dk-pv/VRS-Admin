"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  australiaDuration?: string;
  mortgageYears?: string;
  baPreference?: string;
  isRead: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/login");

    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/contact`);
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages");
    }
    setLoading(false);
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`${API}/api/contact/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`${API}/api/contact/read/${id}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, isRead: true } : msg
        )
      );
      toast.success("Marked as read");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Contact Messages
          </h1>
          <p className="text-gray-500 mt-2">
            Manage website inquiries
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No contact messages yet.
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-6 rounded-2xl shadow-sm transition ${
                  msg.isRead
                    ? "bg-gray-50"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">
                      {msg.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {msg.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {msg.phone}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!msg.isRead && (
                    <span className="text-xs bg-yellow-400 text-black px-3 py-1 rounded-full font-medium">
                      New
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-gray-700 text-sm">

                  {msg.australiaDuration && (
                    <p>
                      <span className="font-medium">
                        Australia Duration:
                      </span>{" "}
                      {msg.australiaDuration}
                    </p>
                  )}

                  {msg.mortgageYears && (
                    <p>
                      <span className="font-medium">
                        Mortgage Years:
                      </span>{" "}
                      {msg.mortgageYears}
                    </p>
                  )}

                  {msg.baPreference && (
                    <div>
                      <p className="font-medium">
                        BA Preference:
                      </p>
                      <p className="mt-1 text-gray-600">
                        {msg.baPreference}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  {!msg.isRead && (
                    <button
                      onClick={() => markAsRead(msg._id)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}