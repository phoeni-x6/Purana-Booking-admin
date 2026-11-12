"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { Role } from "@/lib/auth/require-role";

type AdminLayoutProps = {
  children: React.ReactNode;
  role: Role;
  fullName: string;
};

export default function AdminLayout({
  children,
  role,
  fullName,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-purana-cream">
      <Sidebar
        role={role}
        fullName={fullName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[270px]">
        <Header
          role={role}
          fullName={fullName}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main>{children}</main>
      </div>
    </div>
  );
}
