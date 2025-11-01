"use client"

import Image from 'next/image'

export default function Partners() {
  // Lặp lại dữ liệu nhiều lần để tạo hiệu ứng cuộn vô tận
  const partnerData = [
    { id: 1, name: "Partner 1 (Logo 1)", logo: "/partner/hoi-lien-hiep-thanh-nien-1.png" },
    { id: 2, name: "Partner 2 (Logo 2)", logo: "/partner/So-VH.png" },
    { id: 3, name: "Partner 3 (Logo 3)", logo: "/partner/logo-vfv-1.png" },
    { id: 4, name: "Partner 4 (Logo 4)", logo: "/partner/QUANGARMY-3-3.png" },
    { id: 5, name: "Partner 5 (Logo 5)", logo: "/partner/bc-ccd.png" },
    { id: 6, name: "Partner 6 (Logo 6)", logo: "/partner/thanh-doan.png" },
    { id: 7, name: "Partner 7 (Logo 7)", logo: "/partner/hoi-sinh-vien.png" },
  ]

  // Lặp lại danh sách logo 3 lần để đảm bảo animation mượt mà
  const partners = [...partnerData, ...partnerData, ...partnerData]

  return (
    <section className="pt-0 md:pt-10 pb-0 md:pb-0 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-center mb-4">
          <div className="h-1 w-16 md:w-24 rounded-full bg-orange-600" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-foreground text-center mb-8 uppercase">
          Các đối tác
        </h2>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            className="flex w-fit animate-marquee hover:[animation-play-state:paused] gap-0 md:gap-4"
            style={{ animationDuration: '40s' }}
          >
            {partners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex items-center justify-center h-40 md:h-52 w-[220px] md:w-[260px] flex-shrink-0 mx-0 cursor-pointer"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={partner.logo}
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
  )
}