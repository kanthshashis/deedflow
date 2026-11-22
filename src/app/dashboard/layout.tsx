"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24060B] antialiased relative selection:bg-[#4A0E17] selection:text-white font-sans">
      {/* Dynamic Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none ambient-glow-ivory opacity-80" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-45" />

      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex relative z-10">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 md:pl-64 min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
