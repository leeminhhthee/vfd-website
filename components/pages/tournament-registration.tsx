"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle } from "lucide-react"

export default function TournamentRegistration() {
  const [formData, setFormData] = useState({
    teamName: "",
    coachName: "",
    email: "",
    phone: "",
    tournament: "",
    playerCount: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const tournaments = [
    { id: 1, name: "Giải bóng chuyền nam TP Đà Nẵng" },
    { id: 2, name: "Giải bóng chuyền nữ TP Đà Nẵng" },
    { id: 3, name: "Giải bóng chuyền trẻ toàn quốc" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {submitted && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
          Đơn đăng ký của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.
        </div>
      )}

      <div className="bg-white rounded-lg border border-border p-8">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Vui lòng điền đầy đủ thông tin để hoàn tất đơn đăng ký. Chúng tôi sẽ xác nhận trong vòng 24 giờ.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Chọn giải đấu *</label>
            <select
              name="tournament"
              value={formData.tournament}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Tên đội *</label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              required
              placeholder="Nhập tên đội của bạn"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tên huấn luyện viên *</label>
              <input
                type="text"
                name="coachName"
                value={formData.coachName}
                onChange={handleChange}
                required
                placeholder="Nhập tên huấn luyện viên"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Số vận động viên *</label>
              <input
                type="number"
                name="playerCount"
                value={formData.playerCount}
                onChange={handleChange}
                required
                placeholder="Nhập số vận động viên"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Gửi đơn đăng ký
          </button>
        </form>
      </div>
    </div>
  )
}
