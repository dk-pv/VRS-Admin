"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/login");

    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get(`${API}/api/contact`);
    setMessages(res.data);
  };

  const deleteMessage = async (id: string) => {
    await axios.delete(`${API}/api/contact/${id}`);
    setMessages((prev) =>
      prev.filter((msg) => msg._id !== id)
    );
  };

  const markAsRead = async (id: string) => {
    await axios.put(`${API}/api/contact/read/${id}`);
    fetchMessages();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-8">
        Contact Messages
      </h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`border p-4 rounded-lg ${
              msg.isRead
                ? "bg-white"
                : "bg-yellow-50"
            }`}
          >
            <p className="font-semibold">
              {msg.name}
            </p>
            <p className="text-sm text-gray-600">
              {msg.email}
            </p>
            <p className="mt-2">
              {msg.message}
            </p>

            <div className="flex gap-4 mt-3">
              {!msg.isRead && (
                <button
                  onClick={() =>
                    markAsRead(msg._id)
                  }
                  className="text-blue-600"
                >
                  Mark as Read
                </button>
              )}

              <button
                onClick={() =>
                  deleteMessage(msg._id)
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
  );
}