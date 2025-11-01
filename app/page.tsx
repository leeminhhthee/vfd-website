import UserLayout from "@/components/layouts/user-layout"
import Hero from "@/components/sections/hero"
import LatestNews from "@/components/sections/latest-news"
import UpcomingTournaments from "@/components/sections/upcoming-tournaments"
import Partners from "@/components/sections/partners"
import AboutTeaser from "@/components/sections/about-teaser"
import PhotoGallery from "@/components/sections/photo-gallery"

export default function Home() {
  return (
    <UserLayout>
      <Hero />
      <LatestNews />
      <AboutTeaser />
      <PhotoGallery />
      <UpcomingTournaments />
      <Partners />
    </UserLayout>
  )
}
