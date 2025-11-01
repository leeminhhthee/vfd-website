"use client"

interface GalleryTabsProps {
  categories: Array<{ id: string; label: string }>
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export default function GalleryTabs({ categories, activeCategory, onCategoryChange }: GalleryTabsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap gap-3 md:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
              activeCategory === category.id
                ? "bg-primary text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
