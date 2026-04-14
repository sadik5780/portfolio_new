import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Services from '@/components/Services/Services';
import Projects from '@/components/Projects/Projects';
import Testimonials from '@/components/Testimonials/Testimonials';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import { getAllSettings } from '@/lib/content/settings';
import { getFeaturedProjects } from '@/lib/content/projects';

// Refresh site content from Supabase every 60s (admin mutations also revalidate).
export const revalidate = 60;

export default async function Home() {
  const [settings, featured] = await Promise.all([
    getAllSettings(),
    getFeaturedProjects(6),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero content={settings.hero} stats={settings.stats} />
        <About content={settings.about} skills={settings.skills} />
        <Services content={settings.services} />
        <Projects featured={featured} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
