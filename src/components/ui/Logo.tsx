"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  badge?: string;
  className?: string;
}

export function Logo({
  href = "/",
  size = "md",
  badge,
  className,
}: LogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-9 h-9" : "w-8 h-8";
  const svgSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-4.5 h-4.5";
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  const content = (
    <div className={clsx("flex items-center space-x-2.5 select-none group", className)}>
      <div
        className={clsx(
          iconSize,
          "rounded-xl bg-[#821A2A]/10 border border-[#821A2A]/25 flex items-center justify-center text-[#821A2A] shadow-2xs group-hover:scale-105 group-hover:bg-[#821A2A]/15 transition-all spring-snap shrink-0"
        )}
      >
        <svg
          className={clsx(svgSize, "text-[#821A2A]")}
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
      <div className="flex items-center space-x-2">
        <span className={clsx(textSize, "font-extrabold tracking-tight text-[#24060B] font-sans lowercase leading-none")}>
          deedflow<span className="text-[#821A2A]">.</span>
        </span>
        {badge && (
          <span className="text-[10px] font-mono uppercase bg-[#821A2A]/10 text-[#821A2A] border border-[#821A2A]/20 px-1.5 py-0.5 rounded font-bold">
            {badge}
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
