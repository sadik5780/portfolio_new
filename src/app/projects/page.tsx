import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProjectsGrid from '@/components/ProjectsPage/ProjectsGrid';
import { buildMetadata } from '@/lib/seo';
import { getProjects } from '@/lib/content/projects';
import styles from './page.module.scss';

// Revalidate from Supabase every 60s; admin mutations also call revalidatePath.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: 'Projects — SaaS, Shopify & Web App Case Studies by Sadik',
  description:
    'Explore case studies from Sadik — React, Next.js, Shopify, and SaaS projects delivered for teams in India, USA, and Australia. Hire a senior developer with a track record of shipped work.',
  path: '/projects',
  keywords: [
    'react developer portfolio',
    'shopify developer portfolio',
    'saas developer case studies',
    'next.js developer portfolio india',
    'hire shopify expert usa',
    'hire react developer australia',
  ],
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <SectionHeading
              label="Portfolio"
              title="Selected Projects & Case Studies"
              description="SaaS platforms, headless Shopify stores, and custom web apps — shipped end-to-end for clients across India, the USA, and Australia."
            />
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className={styles.container}>
            <ProjectsGrid projects={projects} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
