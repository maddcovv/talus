/** The Two Track Supply brand mark: two tracks climbing an olive field. */
export function TwoTrackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" aria-hidden="true" className={className}>
      <rect width="34" height="34" rx="4" fill="var(--talus-color-text-link)" />
      <path
        d="M9 31 C12 22 14 15 15.5 4"
        stroke="var(--talus-color-bg-accent)"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M25 31 C22 22 20 15 18.5 4"
        stroke="var(--talus-color-bg-accent)"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
