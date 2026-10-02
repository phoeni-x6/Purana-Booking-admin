import type { Metadata } from "next";
import "./globals.css";
import AdminLayout from "@/components/AdminLayout";

export const metadata: Metadata = {
  title: "Purana Ayurveda | Admin",
  description: "Purana Ayurveda Booking Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}