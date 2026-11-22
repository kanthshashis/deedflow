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
    { href: "/dashboard/approvals", label: "Diff Approvals", icon: RotateCcw, badge: "3", badgeColor: "bg-emerald-500" },
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
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0D191F] text-[#8EA4B0] flex flex-col justify-between border-r border-[#15252E] spring-snap md:translate-x-0 select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Top Brand Logo */}
          <div className="flex items-center space-x-2.5 px-2 pt-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg
                className="w-5 h-5 text-emerald-400"
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
              deedflow<span className="text-emerald-500">.</span>
            </span>
          </div>

          {/* Workspace Selector Card */}
          <div className="p-2.5 rounded-xl bg-[#14232B] border border-[#1C303B] flex items-center justify-between text-xs text-white group cursor-pointer hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                S
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#6E8592] font-medium">Workspace</span>
                <span className="font-semibold text-white truncate max-w-[120px]">Sobha Royal Pavilion</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6E8592] group-hover:text-white transition-colors" />
          </div>

          {/* Super-Admin Access Button if authorized or available */}
          <Link
            href="/super-admin"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Super-Admin Center</span>
            </div>
            <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              Global
            </span>
          </Link>

          {/* Nav List */}
          <div className="space-y-1 pt-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-[#536B77]">
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
                      ? "bg-[#182C35] text-white font-bold"
                      : "text-[#8EA4B0] hover:text-white hover:bg-[#14232B]"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={clsx(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-emerald-400" : "text-[#536B77] group-hover:text-[#8EA4B0]"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={clsx(
                        "text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full",
                        item.badgeColor ? `${item.badgeColor} text-white` : "bg-[#1C303B] text-[#8EA4B0]"
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

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-[#15252E] space-y-2">
          <div className="flex items-center space-x-2 text-[11px] text-[#6E8592] px-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono text-[10px]">UIDAI Masked Workspace</span>
          </div>

          <div className="p-2 rounded-xl bg-[#14232B] border border-[#1C303B] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-600/20 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center">
                AM
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="font-bold text-white block">Aidan Morgan</span>
                <span className="text-[10px] text-[#6E8592] block capitalize">
                  {currentRole.replace("_", " ")}
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 p-1"
              title="Switch Role"
            >
              Exit
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
