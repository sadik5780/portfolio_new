import styles from './BlogQuestionCta.module.scss';

interface BlogQuestionCtaProps {
  postTitle: string;
  postUrl: string;
}

const CONTACT_EMAIL = 'sadik5780@gmail.com';

/**
 * "Got a question about this post?" CTA rendered at the bottom of every blog
 * post. Opens the reader's email client with the post title pre-filled as
 * the subject so they can reply with a real question in one click.
 */
export default function BlogQuestionCta({
  postTitle,
  postUrl,
}: BlogQuestionCtaProps) {
  const subject = `Question about: ${postTitle}`;
  const body = `Hi Sadik,\n\nI was reading your post ${postUrl} and had a question:\n\n\n\n—\nReplying about: ${postTitle}`;
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <aside className={styles.card} aria-label="Ask a question about this article">
      <div className={styles.icon} aria-hidden>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>Got a question about this?</h3>
        <p className={styles.copy}>
          If anything in this post applies to your own project, email me
          directly — I reply within 24 hours, usually less. Not a pitch, just
          an honest conversation about whether we are a fit.
        </p>
      </div>
      <div className={styles.actions}>
        <a href={mailtoHref} className={styles.btn}>
          Email me about this
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </aside>
  );
}
