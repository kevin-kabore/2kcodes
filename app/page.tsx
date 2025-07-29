import { Navigation } from './components/navigation';
import { HeroNew } from './components/hero/hero-new';
import { AboutSection } from './components/sections/about';
import { ExperienceSection } from './components/sections/experience';
import { FeaturedPostsSection } from './components/sections/featured-posts';
import { ContactSection } from './components/sections/contact';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroNew />
        <AboutSection />
        <ExperienceSection />
        <FeaturedPostsSection />
        <ContactSection />
      </main>
    </>
  );
}