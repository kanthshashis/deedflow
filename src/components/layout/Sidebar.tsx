"use client";

import React from "react";
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
  MoreHorizontal,
  Plus,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/dashboard/generate", label: "Documents", icon: FileText },
    { href: "/dashboard/drafts", label: "Drafts", icon: FileEdit, badge: "1" },
    { href: "/dashboard/issued", label: "Issued", icon: Send },
    { href: "/dashboard/templates", label: "Templates", icon: FileCode2 },
    { href: "/dashboard/parking", label: "Basement Grid", icon: Car, isSpecial: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0D191F] text-[#8EA4B0] flex flex-col justify-between border-r border-[#15252E] spring-snap md:translate-x-0 select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 space-y-4">
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
              deedflow
            </span>
          </div>

          {/* Workspace Selector Card */}
          <div className="p-2.5 rounded-xl bg-[#14232B] border border-[#1C303B] flex items-center justify-between text-xs text-white group cursor-pointer hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                N
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#6E8592] font-medium">Workspace</span>
                <span className="font-semibold text-white truncate max-w-[120px]">Northline Homes</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6E8592] group-hover:text-white transition-colors" />
          </div>

          {/* Nav List */}
          <div className="space-y-1 pt-2">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-[#536B77]">
              Workspace
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
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium spring-snap transition-all relative group",
                    isActive
                      ? "bg-[#182C35] text-white font-semibold"
                      : "text-[#8EA4B0] hover:text-white hover:bg-[#13222A]"
                  )}
                >
                  {/* Active Green Bar on Left Edge */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r-full" />
                  )}

                  <div className="flex items-center space-x-2.5">
                    <Icon className={clsx("w-4 h-4", isActive ? "text-emerald-400" : "text-[#708896] group-hover:text-emerald-400")} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-[#13222A] text-[#8EA4B0] border border-[#1C303B]">
                      {item.badge}
                    </span>
                  )}
                  {item.isSpecial && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      CAD
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-[#15252E] space-y-3 bg-[#0A1419]">
          <div className="flex items-center space-x-2 text-[11px] text-[#587381] px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure document workspace</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#13222A] cursor-pointer transition-colors">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#785437] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AM
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-white">Aidan Morgan</span>
                <span className="text-[10px] text-[#6E8592]">Workspace admin</span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#6E8592] hover:text-white" />
          </div>
        </div>
      </aside>
    </>
  );
}
