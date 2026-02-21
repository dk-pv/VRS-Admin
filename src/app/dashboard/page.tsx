"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Video,
  Users,
  MessageSquare,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    webinars: 0,
    team: 0,
    testimonials: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          properties,
          webinars,
          team,
          textTestimonials,
          videoTestimonials,
          contacts,
        ] = await Promise.all([
          fetch(`${API}/api/secured-properties`).then(res => res.json()),
          fetch(`${API}/api/webinars`).then(res => res.json()),
          fetch(`${API}/api/team`).then(res => res.json()),
          fetch(`${API}/api/text-testimonials`).then(res => res.json()),
          fetch(`${API}/api/video-testimonials`).then(res => res.json()),
          fetch(`${API}/api/contact`).then(res => res.json()),
        ]);

        setStats({
          properties: properties.length || 0,
          webinars: webinars.length || 0,
          team: team.length || 0,
          testimonials:
            (textTestimonials.length || 0) +
            (videoTestimonials.length || 0),
        });

        // Example chart data (last 6 months dummy or based on contacts)
        const sampleData = [
          { month: "Jan", enquiries: 12 },
          { month: "Feb", enquiries: 18 },
          { month: "Mar", enquiries: 22 },
          { month: "Apr", enquiries: 30 },
          { month: "May", enquiries: 26 },
          { month: "Jun", enquiries: 35 },
        ];

        setChartData(sampleData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Secured Properties",
      value: stats.properties,
      icon: <Building2 size={22} />,
    },
    {
      title: "Total Webinars",
      value: stats.webinars,
      icon: <Video size={22} />,
    },
    {
      title: "Team Members",
      value: stats.team,
      icon: <Users size={22} />,
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: <MessageSquare size={22} />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black px-10 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-10">
          Admin Dashboard
        </h1>

        {/* ========================= */}
        {/* TOP STATS CARDS */}
        {/* ========================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-yellow-500">
                  {card.icon}
                </div>
              </div>
              <h2 className="text-2xl font-bold">
                {card.value}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {card.title}
              </p>
            </div>
          ))}
        </div>

        {/* ========================= */}
        {/* CHART SECTION */}
        {/* ========================= */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-16 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">
            Customer Enquiries (Last 6 Months)
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="enquiries"
                  stroke="#facc15"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ========================= */}
        {/* QUICK LINKS */}
        {/* ========================= */}
        <div>
          <h2 className="text-lg font-semibold mb-6">
            Quick Links
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <Link
              href="/admin/webinar"
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-yellow-50 transition"
            >
              Manage Webinars
            </Link>

            <Link
              href="/admin/team"
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-yellow-50 transition"
            >
              Manage Team
            </Link>

            <Link
              href="/admin/blog"
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-yellow-50 transition"
            >
              Manage Blogs
            </Link>

            <Link
              href="/admin/testimonials"
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-yellow-50 transition"
            >
              Manage Testimonials
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}