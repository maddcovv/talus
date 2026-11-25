/** The Two Track Supply brand mark: two parallel tracks climbing. */
export function TwoTrackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" className={className}>
      <path
        d="M4.5 20 C8 13 10 9.5 14 4"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M10.5 20 C14 13 16 9.5 20 4"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
