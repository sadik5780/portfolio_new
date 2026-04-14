import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import TechArsenal from '@/components/TechArsenal/TechArsenal';
import Services from '@/components/Services/Services';
import Projects from '@/components/Projects/Projects';
import Testimonials from '@/components/Testimonials/Testimonials';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import { getAllSettings } from '@/lib/content/settings';
import { getFeaturedProjects } from '@/lib/content/projects';
import { getFeaturedTestimonials } from '@/lib/content/testimonials';

// 10-min revalidate; admin mutations call revalidatePath('/') for instant updates.
export const revalidate = 600;

export default async function Home() {
  const [settings, featured, testimonials] = await Promise.all([
    getAllSettings(),
    getFeaturedProjects(6),
    getFeaturedTestimonials(12),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero content={settings.hero} stats={settings.stats} />
        <About content={settings.about} skills={settings.skills} />
        <TechArsenal />
        <Services content={settings.services} />
        <Projects featured={featured} />
        <Testimonials items={testimonials} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
