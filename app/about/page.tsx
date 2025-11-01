import UserLayout from "@/components/layouts/user-layout"
import AboutHero from "@/components/pages/about-hero"
import BoardOfDirectors from "@/components/pages/board-of-directors"
import Introductions from "@/components/pages/introductions"

export default function AboutPage() {
  return (
    <UserLayout>
      <AboutHero />
      <section id="ve-chung-toi">
        <Introductions />
      </section>
      <section id="ban-lanh-dao">
        <BoardOfDirectors />
      </section>
    </UserLayout>
  )
}
