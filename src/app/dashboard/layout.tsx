"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedRole = localStorage.getItem("adminRole");

    if (!token) {
      router.push("/login");
    } else {
      setRole(storedRole || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col justify-between p-5">
        <div>
          <h2 className="text-xl font-bold mb-8">VRS Admin</h2>

          <nav className="flex flex-col gap-4">
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>

            <Link href="/dashboard/media" className="hover:text-gray-300">
              Media Settings
            </Link>

            {/* 👑 Show only if superadmin */}
            {role === "superadmin" && (
              <Link
                href="/dashboard/admins"
                className="hover:text-gray-300"
              >
                Admin Management
              </Link>
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 p-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-100 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
