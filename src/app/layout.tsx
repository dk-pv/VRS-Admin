// import "./globals.css";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "VRS Admin Panel",
//   description: "Admin Dashboard",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         {children}
//       </body>
//     </html>
//   );
// }




import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "VRS Admin Panel",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* ✅ Global Toast */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "14px",
            },
            success: {
              style: {
                background: "#111",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#dc2626",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}