import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './HomeFAQ.module.scss';

interface QA {
  question: string;
  answer: string;
}

export const HOME_FAQS: QA[] = [
  {
    question: 'How much does a custom web app or SaaS cost?',
    answer:
      'React & Next.js builds from $1,500, Shopify stores from $2,000, custom AI automations (chatbots, lead agents, workflow bots) from $2,000, AI-powered features from $2,500, and SaaS MVPs from $10,000. Use the quote builder for a fixed number in 60 seconds.',
  },
  {
    question: 'How fast can you start?',
    answer:
      'Typically 1–2 weeks from signed SOW to kickoff. I take one build at a time so each client gets full attention — book a discovery call to check current availability.',
  },
  {
    question: 'Who actually writes the code?',
    answer:
      'Sadik Shaikh. You are not handed off to a junior or an offshore team — the engineer in your Slack is the engineer shipping every PR, end-to-end. Direct communication, daily.',
  },
  {
    question: 'Are you an agency or a freelancer?',
    answer:
      'Neither. Sadik Studio is a founder-led boutique studio — one senior engineer (Sadik Shaikh, 6+ years) owns your build directly. You get the accountability of a freelancer with the systems and process of an agency, without the agency markup.',
  },
  {
    question: 'Do you work with US, UK, and Australian clients from India?',
    answer:
      'Yes — most engagements are with founders in the USA, UK, and Australia. We overlap with EST mornings, GMT/BST afternoons, and AEST mornings. Billing is in USD by default (GBP for UK on request), and NDAs/MSAs are signed before kickoff.',
  },
  {
    question: 'Can you build custom AI automations for my business?',
    answer:
      'Yes — we build done-for-you AI automation systems: speed-to-lead agents that reply to inquiries in under 60 seconds, AI chatbots trained on your business data, email/SMS follow-up sequences, document processing pipelines, and AI-powered internal tools. We use OpenAI, Anthropic Claude, and Google Gemini. Most AI automation builds ship in 2–3 weeks. You own the system — no monthly SaaS fees.',
  },
];

export default function HomeFAQ() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className={styles.container}>
        <SectionHeading
          label="FAQ"
          title="Questions founders ask before kicking off"
          description="If yours is not here, send us a note — we usually reply within a few hours."
        />

        <div className={styles.list}>
          {HOME_FAQS.map((f, i) => (
            <details key={i} className={styles.item}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/contact" className={styles.btnPrimary}>
            Ask a question
          </Link>
          <Link href="/quote" className={styles.btnSecondary}>
            Get an instant quote
          </Link>
        </div>
      </div>
    </section>
  );
}
