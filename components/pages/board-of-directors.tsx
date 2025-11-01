"use client"

export default function BoardOfDirectors() {
  const directors = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Chủ tịch",
      image: "/placeholder.svg?key=dir1",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Phó Chủ tịch",
      image: "/placeholder.svg?key=dir2",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "Tổng thư ký",
      image: "/placeholder.svg?key=dir3",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      position: "Trưởng ban Kỹ thuật",
      image: "/placeholder.svg?key=dir4",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Ban lãnh đạo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {directors.map((director) => (
            <div key={director.id} className="text-center">
              <img
                src={director.image || "/placeholder.svg"}
                alt={director.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold text-foreground">{director.name}</h3>
              <p className="text-accent font-medium">{director.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
