import React from 'react';

/**
 * 4-Point Sparkle Star (✦)
 * As seen next to "La beauté", in the yellow banner, and in the footer.
 */
export function Sparkle({
  className = '',
  size = 24,
  color = 'currentColor',
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
    </svg>
  );
}

/**
 * 3 Radiating Action Dashes / Pétillement
 * As seen beside "Découvrir nos bars", headings, and in the conversion banner.
 */
export function BurstDoodle({
  className = '',
  direction = 'right',
  color = '#DE1B52',
  size = 28,
}: {
  className?: string;
  direction?: 'left' | 'right' | 'top-right' | 'top' | 'bottom-left';
  color?: string;
  size?: number;
}) {
  let rotation = 0;
  if (direction === 'left') rotation = 180;
  if (direction === 'top-right') rotation = -30;
  if (direction === 'top') rotation = -90;
  if (direction === 'bottom-left') rotation = 150;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Top angled dash */}
      <line x1="8" y1="11" x2="22" y2="6" />
      {/* Center dash */}
      <line x1="6" y1="16" x2="24" y2="16" />
      {/* Bottom angled dash */}
      <line x1="8" y1="21" x2="22" y2="26" />
    </svg>
  );
}

/**
 * Scalloped Edge / Feston Banner Top
 * Continuous decorative wave of rounded arches along the top of a section.
 */
export function ScallopEdge({
  color = '#FFD233',
  height = 14,
  className = '',
}: {
  color?: string;
  height?: number;
  className?: string;
}) {
  const patternId = React.useId().replace(/:/g, '');

  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat-x"
      >
        <defs>
          <pattern
            id={patternId}
            width="28"
            height={height}
            patternUnits="userSpaceOnUse"
          >
            {/* Semicircular scallop pointing UPWARDS into the section above */}
            <path
              d={`M 0 ${height} C 0 ${height * 0.25} 6 0 14 0 C 22 0 28 ${height * 0.25} 28 ${height} Z`}
              fill={color}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

/**
 * Official SOLLY Logo Wordmark
 * Uses the authentic brand asset with smile underline and sparkle star.
 */
export function SollyLogo({
  className = '',
  height = 36,
}: {
  className?: string;
  color?: string;
  height?: number;
}) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/images/solly-logo.png"
        alt="SOLLY"
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain"
      />
    </div>
  );
}
