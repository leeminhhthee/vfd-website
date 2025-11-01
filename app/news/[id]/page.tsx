"use client"

import { useParams } from "next/navigation"
import UserLayout from "@/components/layouts/user-layout"
import NewsDetailContent from "@/components/pages/news-detail-content"
import NewsRelated from "@/components/pages/news-related"

export default function NewsDetailPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsDetailContent newsId={id} />
        <div className="mt-16 border-t border-border pt-12">
          <NewsRelated currentNewsId={id} />
        </div>
      </div>
    </UserLayout>
  )
}
