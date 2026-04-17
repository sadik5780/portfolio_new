import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Services from '@/components/Services/Services';
import Projects from '@/components/Projects/Projects';
import WhyUs from '@/components/WhyUs/WhyUs';
import Testimonials from '@/components/Testimonials/Testimonials';
import HowWeWork from '@/components/HowWeWork/HowWeWork';
import GlobalPresence from '@/components/GlobalPresence/GlobalPresence';
import HomeFAQ from '@/components/HomeFAQ/HomeFAQ';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import { getAllSettings } from '@/lib/content/settings';
import { getFeaturedTestimonials } from '@/lib/content/testimonials';

// 10-min revalidate; admin mutations call revalidatePath('/') for instant updates.
export const revalidate = 600;

export default async function Home() {
  const [settings, testimonials] = await Promise.all([
    getAllSettings(),
    getFeaturedTestimonials(12),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero content={settings.hero} stats={settings.stats} />
        <Services content={settings.services} />
        <Projects />
        <WhyUs />
        <Testimonials items={testimonials} />
        <HowWeWork />
        <GlobalPresence />
        <HomeFAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
