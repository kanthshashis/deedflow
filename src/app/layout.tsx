import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeedFlow — Real Estate Post-Sales Document & Inventory Suite",
  description: "Institutional legal document automation and basement parking inventory reconciliation for Indian real estate builders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF7F2] text-[#24060B] antialiased selection:bg-[#821A2A] selection:text-white">
        {children}
      </body>
    </html>
  );
}
