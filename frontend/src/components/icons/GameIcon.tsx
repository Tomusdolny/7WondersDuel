import styles from './GameIcon.module.css';

type IconSize = 'sm' | 'md' | 'lg';

export function GameIcon({
  src,
  label,
  size = 'md',
  count,
}: {
  src: string;
  label: string;
  size?: IconSize;
  /** Powtórz ikonę `count` razy (np. 3 kamienie). */
  count?: number;
}) {
  const times = Math.max(1, count ?? 1);
  return (
    <span className={`${styles.wrap} ${styles[size]}`} title={label}>
      {Array.from({ length: times }, (_, index) => (
        <img
          key={index}
          src={src}
          alt={index === 0 ? label : ''}
          aria-hidden={index > 0}
          className={styles.img}
          draggable={false}
        />
      ))}
    </span>
  );
}
