"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ScheduleStatus } from "@/data/constants/constants";
import { useState } from "react";

interface RegistrationButtonProps {
  tournamentId: number;
  tournamentName: string;
  registrationOpen: boolean;
  status: ScheduleStatus;
  hasScheduleImage: boolean;
}

export default function RegistrationButton({
  tournamentId,
  tournamentName,
  registrationOpen,
  status,
  hasScheduleImage,
}: RegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled =
    !registrationOpen || status !== ScheduleStatus.COMING || hasScheduleImage;

  let buttonText = trans.registerTournament;
  if (status !== ScheduleStatus.COMING) {
    buttonText = trans.tournamentStartedEnded;
  } else if (!registrationOpen) {
    buttonText = trans.registrationNotOpen;
  } else if (hasScheduleImage) {
    buttonText = trans.scheduleImageAvailable;
  }

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // Thêm logic xử lý đăng ký ở đây
      console.log(
        `Registering for tournament: ${tournamentName} (ID: ${tournamentId})`
      );
      // Tạm thời alert để xác nhận
      alert(`Bạn đã đăng ký giải đấu: ${tournamentName}`);
      console.log(`Thông báo: Bạn đã đăng ký giải đấu: ${tournamentName}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRegister}
      disabled={isDisabled}
      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
        isDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary-dark"
      }`}
    >
      {isLoading ? "Đang xử lý..." : buttonText}
    </button>
  );
}
