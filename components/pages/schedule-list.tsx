"use client";

import { trans } from "@/app/generated/AppLocalization";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  ScheduleStatus,
  getScheduleStatusLabel,
} from "../../data/constants/constants";

export default function ScheduleList() {
  const [selectedStatus, setSelectedStatus] = useState<ScheduleStatus | "all">(
    "all"
  );

  const {
    data: schedules = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: () => tournamentInteractor.getTournamentList(),
  });

  const statuses: (ScheduleStatus | "all")[] = [
    "all",
    ScheduleStatus.COMING,
    ScheduleStatus.ONGOING,
    ScheduleStatus.ENDED,
  ];

  const filteredSchedules =
    selectedStatus === "all"
      ? schedules
      : schedules.filter((s) => s.status === (selectedStatus as string));

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{trans.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Trophy size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-500 text-lg">{trans.loadingError}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Status Filter */}
      <div className="mb-8 flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === status
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {status === "all" ? "Tất cả" : getScheduleStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {schedule.name}
                </h3>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    schedule.status === ScheduleStatus.COMING
                      ? "bg-blue-100 text-blue-700"
                      : schedule.status === ScheduleStatus.ONGOING
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {getScheduleStatusLabel(schedule.status as ScheduleStatus)}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar size={18} className="text-accent" />
                <span>
                  {new Date(schedule.startDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} className="text-accent" />
                <span>{schedule.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users size={18} className="text-accent" />
                <span> -- đội tham gia</span>
              </div>
            </div>

            <Link
              href={`/schedule/${schedule.id}`}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
            >
              {trans.viewDetails}
            </Link>
          </div>
        ))}
      </div>

      {filteredSchedules.length === 0 && (
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">
            {trans.noSchedulesFound}
          </p>
        </div>
      )}
    </div>
  );
}
