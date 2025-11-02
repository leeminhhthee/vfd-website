"use client"

import { RelatedFile } from "@/lib/schedule-data"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { FileText } from "lucide-react"
import Link from "next/link"

interface TournamentDescriptionProps {
  description: string
  startDate: string
  endDate: string
  location: string
  status: "upcoming" | "ongoing" | "completed"
  relatedFiles?: RelatedFile[]
}

export default function TournamentDescription({
  description,
  startDate,
  endDate,
  location,
  status,
  relatedFiles,
}: TournamentDescriptionProps) {
  const statusMap = {
    upcoming: { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-800" },
    ongoing: { label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
    completed: { label: "Đã kết thúc", color: "bg-gray-100 text-gray-800" },
  }

  const { label, color } = statusMap[status]

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="mb-4">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${color}`}>{label}</span>
      </div>

      <div className="mb-6">
        <p className="text-foreground text-base leading-relaxed">{description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <span className="font-semibold text-foreground w-32">Ngày bắt đầu:</span>
          <span className="text-muted-foreground">{format(parseISO(startDate), "dd/MM/yyyy", { locale: vi })}</span>
        </div>

        <div className="flex items-start">
          <span className="font-semibold text-foreground w-32">Ngày kết thúc:</span>
          <span className="text-muted-foreground">{format(parseISO(endDate), "dd/MM/yyyy", { locale: vi })}</span>
        </div>

        <div className="flex items-start">
          <span className="font-semibold text-foreground w-32">Địa điểm:</span>
          <span className="text-muted-foreground">{location}</span>
        </div>
      </div>

      {relatedFiles && relatedFiles.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Tài liệu liên quan</h3>
          <div className="space-y-3">
            {relatedFiles.map((file, index) => (
              <Link 
                key={index} 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted-foreground/10 transition-colors text-primary font-medium"
              >
                <FileText size={20} className="text-primary" />
                <span>{file.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
