import UserLayout from "@/components/layouts/user-layout"
import TournamentRegistration from "@/components/pages/tournament-registration"

export default function RegisterPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Đăng ký giải đấu</h1>
          <p className="text-lg text-muted-foreground">Đăng ký tham gia các giải đấu của Liên đoàn</p>
        </div>

        <TournamentRegistration />
      </div>
    </UserLayout>
  )
}
