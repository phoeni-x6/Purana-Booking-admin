"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-purana-cream">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[270px]">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main>{children}</main>
      </div>
    </div>
  );
}