"use client";
import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserFooter() {
  return (
    <footer className="bg-primary text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 pb-8 border-b border-primary-light flex justify-center">
          <Image
            src={ASSETS.logo.vfv_logo}
            alt={trans.volleyFederDN}
            width={300}
            height={100}
            className="h-16 w-auto"
          />
          <Image
            src={ASSETS.logo.vfd_logo_text}
            alt={trans.volleyFederDN}
            width={300}
            height={100}
            className="h-16 w-auto ml-15 mr-15"
          />
          <Image
            src={ASSETS.logo.danangcity_logo}
            alt={trans.volleyFederDN}
            width={300}
            height={100}
            className="h-16 w-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">{trans.aboutUs}</h3>
            <p className="text-sm text-gray-300 italic text-justify">
              {trans.textAboutUs}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{trans.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/news"
                  className="hover:text-accent transition-colors"
                >
                  {trans.news}
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="hover:text-accent transition-colors"
                >
                  {trans.schedule}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-accent transition-colors"
                >
                  {trans.register}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent transition-colors"
                >
                  {trans.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{trans.contact}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>{trans.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>{trans.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{trans.contactAddress}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">{trans.followUs}</h3>

            {/* Facebook Page Plugin */}
            <div className="mb-4">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61568730625362&tabs&width=280&height=100&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=false&appId"
                width="280"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61568730625362"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Image
                  src={ASSETS.logo.facebook}
                  alt="Facebook"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://www.tiktok.com/@ldbongchuyendanang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shadow-lg"
                aria-label="TikTok"
              >
                <Image
                  src={ASSETS.logo.tiktok}
                  alt="TikTok"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shadow-lg"
                aria-label="YouTube"
              >
                <Image
                  src={ASSETS.logo.youtube}
                  alt="YouTube"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light pt-8 text-center text-sm text-gray-300">
          <p>
            {trans.copyRight}&copy;{trans.copyRightAuthor}
          </p>
        </div>
      </div>
    </footer>
  );
}
