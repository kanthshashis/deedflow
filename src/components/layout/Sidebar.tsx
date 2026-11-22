"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  FileEdit,
  Send,
  FileCode2,
  Car,
  ShieldCheck,
  ChevronDown,
  Layers,
  Sparkles,
  FileArchive,
  RotateCcw,
  PlusCircle,
  Building2,
} from "lucide-react";
import clsx from "clsx";
import { UserRole } from "@/lib/types";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<UserRole>("project_admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("deedflow_active_role") as UserRole | null;
      if (storedRole) {
        setCurrentRole(storedRole);
      }
    }
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/dashboard/draft/new", label: "Verification Studio", icon: FileText, isHighlighted: true },
    { href: "/dashboard/parking", label: "Basement Grid", icon: Car },
    { href: "/dashboard/approvals", label: "Diff Approvals", icon: RotateCcw, badge: "3", badgeColor: "bg-[#7D1826]" },
    { href: "/dashboard/governance", label: "Data Governance", icon: Layers },
    { href: "/dashboard/batch", label: "Batch & Sale Deeds", icon: FileArchive },
    { href: "/dashboard/templates", label: "Template Linter", icon: FileCode2 },
    { href: "/dashboard/drafts", label: "Saved Drafts", icon: FileEdit, badge: "1" },
    { href: "/dashboard/issued", label: "Issued Dossiers", icon: Send },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#1A0508] text-[#C4A9AD] flex flex-col justify-between border-r border-[#34070E] spring-snap md:translate-x-0 select-none shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Top Brand Logo */}
          <div className="flex items-center space-x-2.5 px-2 pt-2">
            <div className="w-8 h-8 rounded-xl bg-[#4A0E17] border border-[#7D1826]/50 flex items-center justify-center text-[#D4B989] shadow-inner">
              <svg
                className="w-5 h-5 text-[#D4B989]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans lowercase">
              deedflow<span className="text-[#D4B989]">.</span>
            </span>
          </div>

          {/* Workspace Selector Card */}
          <div className="p-2.5 rounded-xl bg-[#28070D] border border-[#3E0C14] flex items-center justify-between text-xs text-white group cursor-pointer hover:border-[#B88E3E]/50 transition-colors">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#4A0E17] border border-[#7D1826]/40 flex items-center justify-center font-bold text-[#D4B989] text-xs shadow-xs">
                S
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#A88C90] font-medium">Workspace</span>
                <span className="font-semibold text-white truncate max-w-[120px]">Sobha Royal Pavilion</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#A88C90] group-hover:text-white transition-colors" />
          </div>

          {/* Super-Admin Access Button if authorized or available */}
          <Link
            href="/super-admin"
            className="p-2 rounded-xl bg-[#34070E] hover:bg-[#430B14] border border-[#4E0E19] text-xs text-[#FAF7F2] flex items-center justify-between transition-colors shadow-xs"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#D4B989]" />
              <span className="font-semibold">Super-Admin Center</span>
            </div>
            <span className="text-[9px] font-mono bg-[#B88E3E]/20 text-[#E5C98F] border border-[#B88E3E]/40 px-1.5 py-0.5 rounded font-bold">
              Global
            </span>
          </Link>

          {/* Nav List */}
          <div className="space-y-1 pt-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-[#8C6B71]">
              Workspace Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-gradient-to-r from-[#4A0E17] to-[#34070E] text-white font-bold border border-[#7D1826]/50 shadow-xs"
                      : "text-[#C4A9AD] hover:text-white hover:bg-[#25060B]"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={clsx(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-[#D4B989]" : "text-[#7D5A60] group-hover:text-[#D4B989]"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={clsx(
                        "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full",
                        item.badgeColor ? `${item.badgeColor} text-white` : "bg-[#34070E] text-[#D4B989] border border-[#4E0E19]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer: User Persona Profile Card */}
        <div className="p-3 border-t border-[#34070E] bg-[#160406]">
          <div className="p-2.5 rounded-xl bg-[#28070D] border border-[#3E0C14] flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#4A0E17] border border-[#7D1826]/50 text-[#D4B989] font-bold flex items-center justify-center text-xs shadow-inner">
                {currentRole === "super_admin" ? "SA" : currentRole === "project_admin" ? "AM" : "OP"}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold text-white truncate max-w-[110px]">
                  {currentRole === "super_admin"
                    ? "Vikramaditya Rao"
                    : currentRole === "project_admin"
                    ? "Aidan Morgan"
                    : "Ramesh Sharma"}
                </span>
                <span className="text-[10px] text-[#A88C90] capitalize">
                  {currentRole.replace("_", " ")}
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="text-[10px] text-[#D4B989] hover:underline font-mono"
              title="Switch role"
            >
              Switch
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
