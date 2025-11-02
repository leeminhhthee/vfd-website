"use client"

import { useState } from "react"
import { FileText } from 'lucide-react'

interface RegistrationButtonProps {
    tournamentId: number
    tournamentName: string
    registrationOpen: boolean
    status: "upcoming" | "ongoing" | "completed"
    hasScheduleImage: boolean // THÊM PROP NÀY
}

export default function RegistrationButton({
    tournamentId,
    tournamentName,
    registrationOpen,
    status,
    hasScheduleImage,
}: RegistrationButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const isDisabled = !registrationOpen || status !== "upcoming" || hasScheduleImage

    let buttonText = "Đăng ký giải đấu"
    if (status !== "upcoming") {
        buttonText = "Giải đấu đã bắt đầu/kết thúc"
    } else if (!registrationOpen) {
        buttonText = "Đăng ký chưa mở"
    } else if (hasScheduleImage) {
        buttonText = "Lịch thi đấu đã có (Ngừng đăng ký)"
    }

    const handleRegister = async () => {
        setIsLoading(true)
        try {
            // Thêm logic xử lý đăng ký ở đây
            console.log(`Registering for tournament: ${tournamentName} (ID: ${tournamentId})`)
            // Tạm thời alert để xác nhận
            alert(`Bạn đã đăng ký giải đấu: ${tournamentName}`)
            console.log(`Thông báo: Bạn đã đăng ký giải đấu: ${tournamentName}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleRegister}
            disabled={isDisabled}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"
                }`}
        >
            {isLoading ? "Đang xử lý..." : buttonText}
        </button>
    )
}
