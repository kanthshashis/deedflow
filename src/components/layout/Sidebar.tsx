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
  ChevronDown,
  Layers,
  FileArchive,
  RotateCcw,
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
    { href: "/dashboard/approvals", label: "Diff Approvals", icon: RotateCcw, badge: "3" },
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#FAF7F2] text-[#5C4A4D] flex flex-col justify-between border-r border-[#E8DFD3] spring-snap md:translate-x-0 select-none shadow-[1px_0_12px_rgba(74,14,23,0.02)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Fixed Top Section: Brand & Workspace */}
        <div className="p-4 pb-2 space-y-3 shrink-0 border-b border-[#E8DFD3]/60 bg-[#FAF7F2]">
          {/* Top Brand Logo */}
          <div className="flex items-center space-x-2.5 px-1 pt-1">
            <div className="w-8 h-8 rounded-xl bg-[#821A2A]/10 border border-[#821A2A]/20 flex items-center justify-center text-[#821A2A] shadow-2xs">
              <svg
                className="w-5 h-5 text-[#821A2A]"
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
            <span className="text-xl font-bold tracking-tight text-[#24060B] font-sans lowercase">
              deedflow<span className="text-[#821A2A]">.</span>
            </span>
          </div>

          {/* Workspace Selector Card */}
          <div className="p-2.5 rounded-xl bg-[#FFFDFB] border border-[#DECFC0] flex items-center justify-between text-xs text-[#24060B] group cursor-pointer hover:border-[#821A2A]/40 transition-colors shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#821A2A] flex items-center justify-center font-bold text-white text-xs shadow-xs">
                S
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#8C777A] font-medium">Workspace</span>
                <span className="font-semibold text-[#24060B] truncate max-w-[120px]">Sobha Royal Pavilion</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#8C777A] group-hover:text-[#821A2A] transition-colors" />
          </div>

          {/* Super-Admin Access Button */}
          <Link
            href="/super-admin"
            className="p-2 rounded-xl bg-[#F8F2EC] hover:bg-[#F3EAE0] border border-[#E8DFD3] text-xs text-[#24060B] flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#821A2A]" />
              <span className="font-semibold text-xs">Super-Admin Center</span>
            </div>
            <span className="text-[9px] font-mono bg-[#821A2A]/10 text-[#821A2A] border border-[#821A2A]/20 px-1.5 py-0.5 rounded font-bold">
              Global
            </span>
          </Link>
        </div>

        {/* Scrollable Middle Section: Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-[#8C777A]">
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
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group",
                  isActive
                    ? "bg-[#821A2A]/10 text-[#821A2A] font-bold border border-[#821A2A]/25 shadow-2xs"
                    : "text-[#5C4A4D] hover:text-[#821A2A] hover:bg-[#F8F2EC] font-medium"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={clsx(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-[#821A2A]" : "text-[#8C777A] group-hover:text-[#821A2A]"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={clsx(
                      "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-[#821A2A] text-white"
                        : "bg-[#821A2A]/10 text-[#821A2A] border border-[#821A2A]/20"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Fixed Bottom Section: User Persona Profile Card */}
        <div className="p-3 border-t border-[#E8DFD3] bg-[#FAF7F2] shrink-0">
          <div className="p-2.5 rounded-xl bg-[#FFFDFB] border border-[#DECFC0] flex items-center justify-between text-xs text-[#5C4A4D] shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#821A2A] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {currentRole === "super_admin" ? "SA" : currentRole === "project_admin" ? "AM" : "OP"}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold text-[#24060B] truncate max-w-[110px]">
                  {currentRole === "super_admin"
                    ? "Vikramaditya Rao"
                    : currentRole === "project_admin"
                    ? "Aidan Morgan"
                    : "Ramesh Sharma"}
                </span>
                <span className="text-[10px] text-[#8C777A] capitalize">
                  {currentRole.replace("_", " ")}
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="text-[10px] text-[#821A2A] hover:underline font-mono font-semibold"
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
