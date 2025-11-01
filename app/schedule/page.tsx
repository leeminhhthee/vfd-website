import UserLayout from "@/components/layouts/user-layout"
import ScheduleList from "@/components/pages/schedule-list"

export default function SchedulePage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Lịch thi đấu</h1>
          <p className="text-lg text-muted-foreground">Lịch thi đấu và kết quả các giải đấu</p>
        </div>

        <ScheduleList />
      </div>
    </UserLayout>
  )
}
