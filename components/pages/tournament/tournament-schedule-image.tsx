"use client"

import Image from "next/image"

interface TournamentScheduleImageProps {
  imageUrl?: string
  tournamentName: string
}

export default function TournamentScheduleImage({ imageUrl, tournamentName }: TournamentScheduleImageProps) {
  if (!imageUrl) return null

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={`Lịch trình ${tournamentName}`}
        width={600}
        height={400}
        className="w-full h-auto object-cover"
      />
    </div>
  )
}
