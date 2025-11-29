"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function PhotosManagement() {
  const [showForm, setShowForm] = useState(false)
  const [photos] = useState([
    {
      id: 1,
      name: "Giải vô địch 2024",
      album: "Giải đấu",
      date: "2024-10-25",
      image: "/volleyball-tournament.jpg",
    },
    {
      id: 2,
      name: "Đội tuyển Đà Nẵng",
      album: "Đội tuyển",
      date: "2024-10-20",
      image: "/volleyball-team.jpg",
    },
  ])

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        <Plus size={20} />
        Tải lên hình ảnh
      </button>

      {showForm && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tải lên hình ảnh mới</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowForm(false)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tên hình ảnh *</label>
              <input
                type="text"
                required
                placeholder="Nhập tên hình ảnh"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Album *</label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Giải đấu</option>
                <option>Đội tuyển</option>
                <option>Sự kiện</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Chọn hình ảnh *</label>
              <input
                type="file"
                accept="image/*"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Tải lên
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-muted text-foreground rounded-lg font-bold hover:bg-border transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg border border-border overflow-hidden">
            <img src={photo.image || "/placeholder.svg"} alt={photo.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-foreground mb-2">{photo.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{photo.album}</p>
              <div className="flex gap-2">
                <button className="flex-1 p-2 hover:bg-muted rounded-lg transition-colors">
                  <Edit2 size={18} className="text-accent mx-auto" />
                </button>
                <button className="flex-1 p-2 hover:bg-muted rounded-lg transition-colors">
                  <Trash2 size={18} className="text-red-600 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
