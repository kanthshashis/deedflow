"use client";

import React from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import clsx from "clsx";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  badge?: string;
  subtitle?: string | boolean;
  className?: string;
}

export function Logo({
  href = "/",
  size = "md",
  badge,
  subtitle = "Royal Estate Edition",
  className,
}: LogoProps) {
  const iconBox =
    size === "sm"
      ? "w-8 h-8 rounded-lg"
      : size === "lg"
      ? "w-10 h-10 rounded-xl"
      : "w-9 h-9 rounded-xl";

  const iconSize =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5.5 h-5.5" : "w-5 h-5";

  const titleSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl sm:text-2xl" : "text-base";

  const subtitleText = typeof subtitle === "string" ? subtitle : "Royal Estate Edition";
  const showSubtitle = subtitle !== false;

  const content = (
    <div className={clsx("flex items-center space-x-2.5 select-none group", className)}>
      {/* High-Rise Estate Crest Icon Tile */}
      <div
        className={clsx(
          iconBox,
          "flex items-center justify-center font-bold bg-gradient-to-b from-[#992437] to-[#821A2A] text-white border border-[#992437]/40 shadow-xs group-hover:scale-105 spring-snap shrink-0 relative overflow-hidden"
        )}
      >
        {/* Subtle interior highlight glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
        <Building2 className={clsx(iconSize, "text-[#FAF7F2] relative z-10")} />
      </div>

      {/* Brand Wordmark & Subtitle */}
      <div className="flex flex-col text-left">
        <div className="flex items-center space-x-1.5 leading-none">
          <span className={clsx(titleSize, "font-extrabold tracking-tight text-[#24060B] font-sans")}>
            DeedFlow
          </span>
          {badge && (
            <span className="text-[9px] font-mono uppercase bg-[#821A2A]/10 text-[#821A2A] border border-[#821A2A]/20 px-1.5 py-0.5 rounded font-bold">
              {badge}
            </span>
          )}
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-mono text-[#8C777A] uppercase tracking-wider mt-0.5 font-semibold">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
