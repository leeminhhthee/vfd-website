import UserLayout from "@/components/layouts/user-layout"
import AboutHero from "@/components/pages/about-hero"
import AffectedObjects from "@/components/pages/affected-object"
import BoardOfDirectors from "@/components/pages/board-of-directors"
import Introductions from "@/components/pages/introductions"
import Partners from "@/components/sections/partners"

export default function AboutPage() {
  return (
    <UserLayout>
      <AboutHero />
      <section id="ban-lanh-dao">
        <BoardOfDirectors />
      </section>
      <section id="ve-chung-toi">
        <Introductions />
      </section>
      <AffectedObjects />
      <Partners />
    </UserLayout>
  )
}
