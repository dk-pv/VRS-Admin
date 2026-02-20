"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function AdminBlogPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Blog | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    const res = await axios.get(`${API}/api/blog`);
    setBlogs(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setMetaTitle("");
    setMetaDescription("");
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // CREATE
  const handleCreate = async () => {
    if (!title || !excerpt || !content || !imageFile) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("image", imageFile);

    await axios.post(`${API}/api/blog`, formData);

    resetForm();
    fetchBlogs();
  };

  // DELETE
  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/api/blog/${id}`);
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">
          Manage Blog Articles
        </h1>

        {/* CREATE FORM */}
        <div className="grid gap-4 mb-10">

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <textarea
            placeholder="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <textarea
            placeholder="Full Blog Content (HTML supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Meta Title (SEO)"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Meta Description (SEO)"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="file"
            ref={fileRef}
            onChange={(e) =>
              e.target.files &&
              setImageFile(e.target.files[0])
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={handleCreate}
            className="bg-black text-white py-3 rounded-lg"
          >
            Publish Blog
          </button>
        </div>

        {/* BLOG LIST */}
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">
                  {blog.title}
                </p>
                <p className="text-sm text-gray-500">
                  /blog/{blog.slug}
                </p>
              </div>

              <button
                onClick={() => handleDelete(blog._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}