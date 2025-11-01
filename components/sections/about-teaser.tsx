"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import Image from "next/image";
import Link from "next/link";

export default function AboutTeaser() {
  return (
    <section className="relative w-full min-h-[50vh] flex items-center justify-center py-20 bg-gray-900">
      <div className="absolute inset-0 z-0">
        <Image
          src={ASSETS.images.bannner}
          alt={trans.volleyFederDN}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase mb-6 drop-shadow-lg">
          {trans.volleyballFederationDanang.toUpperCase()}
        </h2>

        {/* Subtitle/Mission Statement */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light">
          {trans.programDescription}
        </p>

        {/* CTA Button */}
        <Link
          href="/about"
          className="inline-block px-10 py-3 bg-red-700 text-white font-bold rounded-lg shadow-xl hover:bg-red-800 transition-all duration-300 transform hover:scale-105"
        >
          {trans.readMore}
        </Link>
      </div>
    </section>
  );
}
