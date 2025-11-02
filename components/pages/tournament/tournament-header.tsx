"use client"

interface TournamentHeaderProps {
  name: string
}

export default function TournamentHeader({ name }: TournamentHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-primary">{name}</h1>
      <div className="h-1 w-24 bg-accent rounded mt-3"></div>
    </div>
  )
}
