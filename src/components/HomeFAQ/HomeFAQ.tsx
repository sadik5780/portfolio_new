import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './HomeFAQ.module.scss';

interface QA {
  question: string;
  answer: string;
}

export const HOME_FAQS: QA[] = [
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
    question: 'How much does a custom web app or SaaS cost?',
    answer:
      'Landing pages from $200, Shopify stores from $2,000, AI-powered features from $2,500, and SaaS MVPs from $10,000. Use the quote builder for a fixed number in 60 seconds — every tier has public pricing on the site.',
  },
  {
    question: 'How fast can you start?',
    answer:
      '1–2 weeks from signed SOW to kickoff. We deliberately take on only 2 new projects per quarter to stay founder-led — book a discovery call to check current availability.',
  },
  {
    question: 'Who actually writes the code?',
    answer:
      'Sadik Shaikh. You are not handed off to a junior or an offshore team — the engineer in your Slack is the engineer shipping every PR, end-to-end. Direct communication, daily.',
  },
  {
    question: 'Can you add AI features to our existing SaaS or web app?',
    answer:
      'Yes — that is one of our core services. We add OpenAI / Anthropic chatbots, semantic search, document Q&A, and RAG pipelines into existing React, Next.js, and SaaS apps. Most AI feature builds ship in 2–4 weeks with cost dashboards and evals included.',
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
