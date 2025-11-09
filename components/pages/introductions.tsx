"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { useQuery } from "@tanstack/react-query";

type Props = {
  backgroundUrl?: string;
};

export default function Introductions({
  backgroundUrl = ASSETS.images.bg,
}: Props) {
  const {
    data: allIntroduction = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["introduction"],
    queryFn: aboutInteractor.getIntroduction,
  });

  if (isLoading) {
    return <div className="text-center py-12">{trans.loading}</div>;
  }

  if (error) {
    return <div className="text-center py-12">{trans.loadingError}</div>;
  }

  return (
    <section
      className="relative py-20 md:py-22 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold italic tracking-wider text-white">
            {trans.ourValue}
          </h2>
          <p className="mt-2 text-base md:text-xl text-white/80">
            {trans.valueWeAimFor}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {allIntroduction.map((section) => (
            <div
              key={section.title}
              className="bg-[#0B3B88]/95 text-white rounded-[28px] md:rounded-[40px] p-6 md:p-10 shadow-2xl backdrop-blur-[1px] h-full"
            >
              <h3 className="text-2xl md:text-4xl font-extrabold italic text-center mb-4 md:mb-6">
                {section.title}
              </h3>
              <p className="text-white/90 text-base md:text-sm leading-relaxed text-center text-justify">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
