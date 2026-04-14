import Link from 'next/link';
import styles from './Logo.module.scss';

export type LogoVariant = 'full' | 'short' | 'icon';
export type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  /** full = icon + "Sadik Studio"; short = icon + "Sadik"; icon = mark only */
  variant?: LogoVariant;
  size?: LogoSize;
  /** Pass false to render an inline span instead of a Link. Default: '/'. */
  href?: string | false;
  className?: string;
  /** Disable the entry fade-in animation (e.g. for static lists). */
  noAnimation?: boolean;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  href = '/',
  className,
  noAnimation = false,
}: LogoProps) {
  // Outlined-frame icon: gradient border ring with a gradient-text "S" inside.
  // The two-element nesting (frame + inner) is what gives us a rounded
  // gradient stroke that's not achievable with `border-image` + radius.
  const inner = (
    <>
      <span className={styles.iconFrame} aria-hidden="true">
        <span className={styles.iconInner}>
          <span className={styles.iconLetter}>S</span>
        </span>
      </span>
      {variant !== 'icon' && (
        <span className={styles.wordmark}>
          <span className={styles.brand}>Sadik</span>
          {variant === 'full' && <span className={styles.suffix}>Studio</span>}
        </span>
      )}
    </>
  );

  const labelText =
    variant === 'icon' ? 'Sadik Studio' : variant === 'short' ? 'Sadik' : 'Sadik Studio';

  const cls = [
    styles.root,
    styles[`size_${size}`],
    noAnimation ? '' : styles.animated,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (href === false) {
    return (
      <span className={cls} aria-label={variant === 'icon' ? labelText : undefined}>
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cls}
      aria-label={variant === 'icon' ? labelText : undefined}
    >
      {inner}
    </Link>
  );
}
