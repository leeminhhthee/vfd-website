"use client"

import type React from "react"
import { useState } from "react"
import { Save } from "lucide-react"

export default function SettingsManagement() {
  const [settings, setSettings] = useState({
    siteName: "Liên đoàn Bóng chuyền TP Đà Nẵng",
    email: "info@volleyball.dn",
    phone: "(0236) 123 4567",
    address: "Đà Nẵng, Việt Nam",
    facebook: "https://facebook.com/volleyball.dn",
    instagram: "https://instagram.com/volleyball.dn",
    description: "Liên đoàn Bóng chuyền TP Đà Nẵng - Nơi phát triển tài năng bóng chuyền",
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl">
      {saved && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
          Cài đặt đã được lưu thành công!
        </div>
      )}

      <div className="bg-white rounded-lg border border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Information */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Thông tin website</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Tên website *</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Mô tả *</label>
                <textarea
                  name="description"
                  value={settings.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Thông tin liên hệ</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Địa chỉ *</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Mạng xã hội</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Facebook</label>
                <input
                  type="url"
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={settings.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            <Save size={20} />
            Lưu cài đặt
          </button>
        </form>
      </div>
    </div>
  )
}
