"use client";

import { trans } from "@/app/generated/AppLocalization";
import { partnerInteractor } from "@/data/datasource/partner/interactor/partner.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import Image from "next/image";

export default function Partners() {
  const {
    data: partnerData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["partners"],
    queryFn: partnerInteractor.getPartnerList,
  });

  if (isLoading) {
    return (
      <section className="pt-0 md:pt-10 pb-0 md:pb-0 bg-white">
        <div className="w-full h-[50vh] flex items-center justify-center">
          <Spin size="large" />
          <span className="text-gray-500 font-medium text-sm ml-5">
            {trans.loading}
          </span>
        </div>
      </section>
    );
  }

  if (error || !partnerData) {
    return null;
  }

  const partners = [...partnerData, ...partnerData, ...partnerData];

  return (
    <section className="pt-0 md:pt-10 pb-0 md:pb-0 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <div className="h-1 w-16 md:w-24 rounded-full bg-orange-600" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-foreground text-center mb-8 uppercase">
          {trans.partnersSponsors}
        </h2>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            className="flex w-fit animate-marquee hover:[animation-play-state:paused] gap-0 md:gap-4"
            style={{ animationDuration: "40s" }}
          >
            {partners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex items-center justify-center h-40 md:h-52 w-[220px] md:w-[260px] flex-shrink-0 mx-0 cursor-pointer"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={partner.imageUrl}
                    alt={partner.name}
                    title={partner.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 360px, (min-width: 768px) 300px, 260px"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="mx-auto h-1 w-full max-w-7xl rounded-full bg-orange-600" />
        </div>
      </div>
    </section>
  );
}
