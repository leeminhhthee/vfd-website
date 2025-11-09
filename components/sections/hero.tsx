"use client";

import { trans } from "@/app/generated/AppLocalization";
import { homeInteractor } from "@/data/datasource/home/interactor/home.interactor";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTO_SLIDE_INTERVAL = 5000;

export default function Hero() {
  const {
    data: heroes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["heroes"],
    queryFn: homeInteractor.getHeroList,
  });

  const [current, setCurrent] = useState(0);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? (heroes?.length ?? 1) - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % (heroes?.length ?? 1));

  useEffect(() => {
    if (!heroes || heroes.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroes.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [heroes]);

  if (isLoading) {
    return (
      <section className="relative w-full overflow-hidden pt-20 min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-white">{trans.loading}</div>
      </section>
    );
  }

  if (error || !heroes || heroes.length === 0) {
    return (
      <section className="relative w-full overflow-hidden pt-20 min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-white">{trans.unableToLoadData}</div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden pt-20 min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)]">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 z-20">
        {heroes.map((hero, index) => (
          <div
            key={hero.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              current === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={hero.image}
                alt={hero.title ?? ""}
                fill
                sizes="100vw"
                className="object-cover object-center"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                priority={index === 0}
                quality={90}
              />
            </div>

            <div className="absolute inset-0 bg-black/10 lg:bg-gradient-to-t lg:from-black/40 lg:to-transparent"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 z-20">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 animate-in fade-in-up duration-1000 ease-out [text-shadow:_0_4px_8px_rgb(0_0_0_/_70%)]">
                {hero.title}
              </h1>
              <p className="text-lg md:text-xl mb-10 max-w-3xl font-medium text-gray-100 animate-in fade-in-up delay-200 duration-1000 ease-out [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)]">
                {hero.subTitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {hero.buttonText != null && hero.buttonHref != null && (
                  <Link
                    href={hero.buttonHref ?? "/"}
                    className="px-8 py-3 bg-accent text-primary font-bold rounded-full hover:bg-accent-light transition-all duration-300 shadow-xl hover:scale-[1.03]"
                  >
                    {hero.buttonText}
                  </Link>
                )}
                {hero.buttonText2 != null && hero.buttonHref2 != null && (
                  <Link
                    href={hero.buttonHref2 ?? "/"}
                    className="px-8 py-3 border-2 border-white/60 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 shadow-xl hover:scale-[1.03]"
                  >
                    {hero.buttonText2}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 p-3 rounded-full text-white transition duration-300 z-30 opacity-70 hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 p-3 rounded-full text-white transition duration-300 z-30 opacity-70 hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {heroes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border border-white ${
              current === index
                ? "bg-accent scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
