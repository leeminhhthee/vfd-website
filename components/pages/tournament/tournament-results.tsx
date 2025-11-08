"use client";

import { trans } from "@/app/generated/AppLocalization";
import { getRoundLabel } from "@/data/constants/constants";
import { MatchSchedule } from "@/data/model/tournament.model";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface TournamentResultsProps {
  results?: MatchSchedule[];
  hasScheduleImage: boolean;
}

export default function TournamentResults({
  results,
  hasScheduleImage,
}: TournamentResultsProps) {
  if (!results || results.length === 0 || !hasScheduleImage) {
    return null;
  }

  // Nhóm kết quả theo vòng
  const groupedByRound = results.reduce((acc, result) => {
    if (!acc[result.round]) {
      acc[result.round] = [];
    }
    acc[result.round].push(result);
    return acc;
  }, {} as Record<string, MatchSchedule[]>);

  const formatDateTime = (date: Date) => {
    try {
      return {
        date: format(date, "dd/MM/yyyy", { locale: vi }),
        time: format(date, "HH:mm", { locale: vi }),
      };
    } catch (error) {
      return { date: "", time: "" };
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg border border-border overflow-hidden">
      <div className="bg-primary text-white p-4">
        <h3 className="text-lg font-bold">{trans.tournamentResults}</h3>
      </div>

      <div className="divide-y divide-border">
        {Object.entries(groupedByRound).map(([round, roundResults]) => (
          <div key={round} className="p-4">
            <h4 className="font-semibold text-foreground mb-3">
              {getRoundLabel(round)}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 w-10">{trans.index}</th>
                    <th className="text-left p-2 w-24">{trans.dateTime}</th>
                    <th className="text-left p-2 w-[40%]">{trans.team}</th>
                    <th className="text-center p-2 w-14">{trans.score}</th>
                    <th className="text-right p-2 w-[40%]">{trans.team}</th>
                  </tr>
                </thead>
                <tbody>
                  {roundResults.map((result, idx) => {
                    const { date, time } = formatDateTime(result.matchDate);
                    return (
                      <tr
                        key={result.id}
                        className="border-t border-border hover:bg-muted align-top"
                      >
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 text-muted-foreground">
                          <div>{date}</div>
                          <div>{time}</div>
                        </td>
                        <td className="p-2 font-medium whitespace-normal break-words align-top">
                          {result.teamA}
                        </td>
                        <td className="p-2 text-center font-bold align-top">
                          {result.scoreA} - {result.scoreB}
                        </td>
                        <td className="p-2 font-medium text-right whitespace-normal break-words align-top">
                          {result.teamB}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
