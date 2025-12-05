import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/comp/NavBar";
import Footer from "@/comp/Footer";
import { Suspense } from "react";

const poppins = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Titan | Games Store",
  description: "Games Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} select-none antialiased text-neutral-300 bg-linear-to-l from-neutral-800 to-neutral-950 min-h-screen`}
      >
        <NavBar />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Footer />
      </body>
    </html>
  );
}
