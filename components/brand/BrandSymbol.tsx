type BrandSymbolProps = {
  className?: string;
};

export function BrandSymbol({ className }: BrandSymbolProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      data-brand-symbol="precision-clean"
      fill="none"
      focusable="false"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="7" y="8" width="43" height="44" rx="9" stroke="currentColor" strokeWidth="5" />
      <circle cx="19" cy="21" r="4" fill="currentColor" />
      <path d="M11 45 23 32l8 9 7-7 10 11H11Z" fill="currentColor" />
      <circle cx="42" cy="20" r="2.75" fill="currentColor" />
      <circle cx="42" cy="28" r="2.75" fill="currentColor" />
      <circle cx="42" cy="36" r="4" stroke="currentColor" strokeDasharray="2.5 2.5" strokeWidth="2.5" />
      <path d="M46 36c5 1 8 5 10 9" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      <circle cx="57" cy="50" r="4.5" fill="currentColor" />
    </svg>
  );
}
