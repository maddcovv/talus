/** The RECEIVED postmark stamped on the sent-screen postcard. */
export function Postmark({ className }: { className?: string }) {
  const ink = "var(--talus-color-text-link)";
  const display = "var(--talus-font-family-display)";
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className} style={{ overflow: "visible" }}>
      <defs>
        <path
          id="postmark-ring"
          d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0"
        />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="54"
        style={{ fill: "color-mix(in srgb, var(--talus-color-bg-feature) 60%, transparent)" }}
        stroke={ink}
        strokeWidth="3"
      />
      <circle cx="60" cy="60" r="31" fill="none" stroke={ink} strokeWidth="2" />
      <text
        style={{ fontFamily: display }}
        fontWeight="800"
        fontSize="11.5"
        letterSpacing="1.5"
        fill={ink}
      >
        <textPath href="#postmark-ring">SALIDA, COLO. · NOV 25 2026 ·</textPath>
      </text>
      <text
        x="60"
        y="57"
        textAnchor="middle"
        style={{ fontFamily: display }}
        fontWeight="900"
        fontSize="12"
        fill={ink}
      >
        RECEIVED
      </text>
      <text
        x="60"
        y="72"
        textAnchor="middle"
        style={{ fontFamily: display }}
        fontWeight="700"
        fontSize="10"
        fill={ink}
      >
        5:14 PM
      </text>
    </svg>
  );
}
