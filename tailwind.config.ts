import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas-bg, #FAF7F2)", // Royal Ivory base
        surface: {
          DEFAULT: "var(--surface-bg, #FFFDFB)", // Primary warm card surface
          muted: "var(--surface-muted, #F5EFE6)",   // Secondary nested card
          elevated: "var(--surface-elevated, #FFFDFB)",
          hover: "var(--surface-hover, #F0E9DD)",
        },
        border: {
          DEFAULT: "var(--border-color, #E8E1D5)", // Champagne warm hairline
          strong: "var(--border-strong, #DFD3C1)",
          subtle: "var(--border-subtle, #F0E8DC)",
        },
        ink: {
          DEFAULT: "var(--ink-primary, #1C1917)", // Deep Noble Charcoal
          secondary: "var(--ink-secondary, #575048)", // Warm Taupe Slate
          muted: "var(--ink-muted, #877F76)",     // Refined Stone
          faint: "var(--ink-faint, #A89F94)",
        },
        burgundy: {
          DEFAULT: "#4A0E17",   // Imperial Royal Burgundy
          hover: "#380910",     // Deepest Oxblood Noir
          light: "#FBF2F3",     // Soft Burgundy Blush
          border: "#E8C8CC",    // Refined Rose-Maroon Hairline
          dark: "#24060B",      // Bordeaux Obsidian
          accent: "#7D1826",    // Royal Wax Seal Maroon
        },
        gold: {
          DEFAULT: "#B88E3E",   // Royal Burnished Gold
          hover: "#9C752E",
          light: "#F7F1E6",
          border: "#DFD1B8",
        },
        royal: {
          DEFAULT: "#4A0E17",   // Imperial Burgundy
          ivory: "#FAF7F2",     // Royal Warm Alabaster Canvas
          card: "#FFFDFB",      // Pure Warm Porcelain Card
          champagne: "#E8E1D5", // Antique Champagne Border
          gold: "#C5A059",      // Fine Gold
        },
        brand: {
          DEFAULT: "#5E6AD2",   // Linear Indigo accent
          hover: "#717EE8",
          glow: "rgba(94, 106, 210, 0.25)",
          light: "rgba(94, 106, 210, 0.12)",
        },
        emerald: {
          DEFAULT: "#0F4C3A",   // Imperial British Emerald
          hover: "#0A392B",
          glow: "rgba(15, 76, 58, 0.25)",
          light: "#ECFDF5",
        },
        amber: {
          DEFAULT: "#B45309",
          light: "#FFFBEB",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          '"JetBrains Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.015em",
      },
      boxShadow: {
        hairline: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        card: "0 1px 3px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        glow: "0 0 24px -4px rgba(94, 106, 210, 0.35)",
        "glow-emerald": "0 0 24px -4px rgba(16, 185, 129, 0.35)",
        floating: "0 24px 48px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
