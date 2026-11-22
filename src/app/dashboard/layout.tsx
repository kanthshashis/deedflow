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
    <div className="min-h-screen bg-[#FAF7F2] text-[#24060B] antialiased relative selection:bg-[#821A2A] selection:text-white font-sans">
      {/* Dynamic Ambient Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none ambient-glow-ivory opacity-80" />

      {/* Grid Pattern Overlay */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none bg-grid-ivory opacity-45" />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Layout Area - Offset cleanly by md:pl-64 on desktop */}
      <div className="md:pl-64 flex flex-col min-h-screen transition-all relative z-10">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
