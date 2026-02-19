"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Image, Users, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedRole = localStorage.getItem("adminRole");

    if (!token) {
      router.push("/login");
    } else {
      setRole(storedRole || "");
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    router.push("/login");
  };

  if (loading) return null;

  const menuItemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      pathname === path
        ? "bg-[#d4af37] text-black font-medium"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-72 bg-[#0f0f0f] text-white flex flex-col justify-between p-6 shadow-2xl">

        {/* Top Section */}
        <div>
          <h2 className="text-2xl font-semibold tracking-wide mb-10 text-[#d4af37]">
            VRS Admin
          </h2>

          <nav className="flex flex-col gap-3">

            <Link href="/dashboard" className={menuItemClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/dashboard/media"
              className={menuItemClass("/dashboard/media")}
            >
              <Image size={18} />
              Hero Media
            </Link>

            <Link
              href="/dashboard/secured-properties"
              className={menuItemClass("/dashboard/secured-properties")}
            >
              <Image size={18} />
              Secured Properties
            </Link>
            <Link
              href="/dashboard/propertys-showcase"
              className={menuItemClass("/dashboard/propertys-showcase")}
            >
              <Image size={18} />
              Properties Showcase
            </Link>

            <Link
              href="/dashboard/discover-video-section"
              className={menuItemClass("/dashboard/discover-video-section")}
            >
              <Image size={18} />
              Discover Video Section  
            </Link>

            {role === "superadmin" && (
              <Link
                href="/dashboard/admins"
                className={menuItemClass("/dashboard/admins")}
              >
                <Users size={18} />
                Admin Management
              </Link>
            )}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
