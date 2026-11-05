export function MexicoFlag({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 18" className={className} aria-hidden="true" role="img">
      <rect width="28" height="18" fill="#fff" />
      <rect width="9.33" height="18" fill="#006847" />
      <rect x="18.67" width="9.33" height="18" fill="#CE1126" />
      <circle cx="14" cy="9" r="3.1" fill="none" stroke="#8C6A2A" strokeWidth="0.7" />
      <circle cx="14" cy="9" r="1.3" fill="#8C6A2A" opacity="0.65" />
    </svg>
  );
}

export function USFlag({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 18" className={className} aria-hidden="true" role="img">
      <rect width="28" height="18" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((row) => (
        <rect key={row} y={row * 1.25 + 0.6} width="28" height="1.25" fill="#B22234" />
      ))}
      <rect width="12" height="9.4" fill="#3C3B6E" />
      {[1.6, 4.1, 6.6, 9.1].map((y) =>
        [1.6, 4.1, 6.6, 9.1].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y - 0.5} r="0.42" fill="#fff" />
        ))
      )}
    </svg>
  );
}
