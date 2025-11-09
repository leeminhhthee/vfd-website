"use client";

import Image from "next/image";

interface TournamentScheduleImageProps {
  imageUrls?: string[];
  tournamentName: string;
}

export default function TournamentScheduleImage({
  imageUrls,
  tournamentName,
}: TournamentScheduleImageProps) {
  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <div className="space-y-4">
      {imageUrls.map((imageUrl, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-border overflow-hidden"
        >
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`Lịch trình ${tournamentName} - Ảnh ${index + 1}`}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      ))}
    </div>
  );
}
