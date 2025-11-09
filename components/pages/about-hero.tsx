"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import Image from "next/image";

export default function AboutHero() {
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
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase mb-6 drop-shadow-lg">
          {trans.aboutVFD}
        </h1>
        <p className="text-lg text-white max-w-3xl text-balance leading-relaxed font-light">
          {trans.textAboutVFD}
        </p>
      </div>
    </section>
  );
}
