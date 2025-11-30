"use client";

import Image from "next/image";
import Titan from "@/public/titans.jpg";
import { usePathname } from "next/navigation";

export default function Footer() {
  const path = usePathname();

  if (path === "/Account") return <></>;
  return (
    <footer className="w-full border-t border-neutral-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-start items-center md:text-start text-center justify-between gap-10">
        <div>
          <div className="flex items-center gap-5">
            <Image
              src={Titan}
              alt="Titan Logo"
              width={90}
              height={90}
              className="rounded-full"
            />
            <div className="text-xl font-semibold flex flex-col leading-tight">
              <span>Titan</span>
              <span className="text-neutral-400">Game Store</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-neutral-300 text-sm">
            <p>
              🕒 Working Hours:{" "}
              <span className="text-white">10:00 - 22:00</span>
            </p>
            <p>💳 Payment Methods: PayPal, Credit Card, Bank Transfer, etc</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-neutral-300 text-sm">
          <h3 className="text-white text-lg font-semibold mb-2">Quick Links</h3>
          <a className="hover:text-white transition" href="/shop">
            Store
          </a>
          <a className="hover:text-white transition" href="/contact">
            Contact
          </a>
          <a className="hover:text-white transition" href="/support">
            Support
          </a>
          <a className="hover:text-white transition" href="/faq">
            FAQ
          </a>
        </div>
        <div className="text-neutral-300 text-sm">
          <h3 className="text-white text-lg font-semibold mb-2">
            Support me on Socials
          </h3>

          <div className="flex flex-col gap-3">
            <a
              className="hover:text-white transition"
              href="https://instagram.com"
              target="_blank"
            >
              📸 Instagram
            </a>
            <a
              className="hover:text-white transition"
              href="https://tiktok.com"
              target="_blank"
            >
              🎵 TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-700 py-5 text-center text-neutral-600 text-xs">
        © {new Date().getFullYear()} Titan Game Store — All Rights Reserved
      </div>
    </footer>
  );
}
