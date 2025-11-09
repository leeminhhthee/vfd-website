"use client"

interface GalleryHeaderProps {
  title: string
  categories: Array<{ id: string; label: string }>
}

export default function GalleryHeader({ title, categories }: GalleryHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#0033cc] via-[#0052ff] to-red-600 text-white py-12 md:py-16 overflow-hidden">
      <div className="absolute right-0 top-1/2 w-80 h-80 bg-red-500 opacity-10 rounded-full -translate-y-1/2 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
            <div className="flex flex-wrap gap-4 text-sm md:text-base font-semibold">
              {categories.map((cat) => (
                <span key={cat.id} className="text-gray-100">
                  {cat.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
