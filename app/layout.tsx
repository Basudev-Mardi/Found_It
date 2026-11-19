import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindIt | Campus Lost & Found",
  description: "One Campus. One Community. Every Belonging Matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#f5f8f8] text-slate-800">
        {children}
      </body>
    </html>
  );
}

