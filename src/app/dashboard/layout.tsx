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
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      pathname === path
        ? "bg-[#d4af37] text-black font-semibold shadow-md"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f0f0f] text-white flex flex-col justify-between px-6 py-8 shadow-2xl sticky top-0 h-screen">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-wide text-[#d4af37]">
              VRS Admin
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Luxury Real Estate Panel
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-2 pr-2">
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
              href="/dashboard/webinar"
              className={menuItemClass("/dashboard/webinar")}
            >
              <Image size={18} />
              Webinar
            </Link>

            <Link
              href="/dashboard/discover-video-section"
              className={menuItemClass("/dashboard/discover-video-section")}
            >
              <Image size={18} />
              Discover Video
            </Link>

            <Link
              href="/dashboard/Team-section"
              className={menuItemClass("/dashboard/Team-section")}
            >
              <Users size={18} />
              Team Section
            </Link>

            <Link
              href="/dashboard/text-testimonials"
              className={menuItemClass("/dashboard/text-testimonials")}
            >
              <Image size={18} />
              Text Testimonials
            </Link>

            <Link
              href="/dashboard/video-testimonials"
              className={menuItemClass("/dashboard/video-testimonials")}
            >
              <Image size={18} />
              Video Testimonials
            </Link>

            <Link
              href="/dashboard/blog"
              className={menuItemClass("/dashboard/blog")}
            >
              <Image size={18} />
              Blog
            </Link>

            {/* {role === "superadmin" && (
              <Link
                href="/dashboard/admins"
                className={menuItemClass("/dashboard/admins")}
              >
                <Users size={18} />
                Admin Management
              </Link>
            )} */}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-8 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-xl p-10 min-h-full border border-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
}
