// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const handleLogin = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Login failed");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("adminToken", data.token);
//       localStorage.setItem("adminRole", data.admin.role);

//       router.push("/dashboard");
//     } catch (error) {
//       setError("Server error. Try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
//       <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">

//         {/* Logo / Title */}
//         <div className="text-center">
//           <h1 className="text-3xl font-semibold tracking-tight">
//             VRS Admin Panel
//           </h1>
//           <p className="text-gray-500 mt-2 text-sm">
//             Secure access to dashboard
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-5">

//           {/* Email */}
//           <div>
//             <label className="text-sm font-medium block mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder="admin@vrs.com"
//               className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm font-medium block mb-1">
//               Password
//             </label>

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter password"
//                 className="w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-black outline-none transition"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />

//               <button
//                 type="button"
//                 className="absolute right-4 top-3.5 text-gray-500 hover:text-black"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <p className="text-red-600 text-sm font-medium">
//               {error}
//             </p>
//           )}

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition font-medium"
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-xs text-gray-400">
//           © {new Date().getFullYear()} VRS Real Estate
//         </p>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole", data.admin.role);

      toast.success("Login successful");

      router.push("/dashboard");
    } catch {
      toast.error("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-10 space-y-8 border border-gray-200">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide text-black">
            VRS Admin
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Secure Dashboard Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-2 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@vrs.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium block mb-2 text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-500 hover:text-black transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} VRS Real Estate. All rights reserved.
        </p>

      </div>
    </div>
  );
}