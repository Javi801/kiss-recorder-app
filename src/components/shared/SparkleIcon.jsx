// Pixel-art style sparkle star group icon.
// Each palette matches one of the four color variants in the design reference.

export { SPARKLE_PALETTES, PALETTE_SWATCHES } from './SparkleIcon.constants'

const PALETTES = {
  yellow:   { O: '#FF8101', M: '#FFA102', I: '#FFDC00', H: '#FFFBE3' },
  pink:   { O: '#da4496', M: '#e873a7', I: '#FABAD5', H: '#FEF1FB' },
  blue:   { O: '#4675E1', M: '#6699fe', I: '#97BDFC', H: '#F5F5F3' },
  purple: { O: '#8950FF', M: '#B58DFF', I: '#D3C0F8', H: '#F8F2F3' },
}

// 4-pointed sparkle star path using quadratic beziers.
// rx/ry = horizontal/vertical outer radius; inner = concavity depth.
function starPath(cx, cy, rx, ry, inner) {
  return [
    `M ${cx} ${cy - ry}`,
    `Q ${cx + inner} ${cy - inner} ${cx + rx} ${cy}`,
    `Q ${cx + inner} ${cy + inner} ${cx} ${cy + ry}`,
    `Q ${cx - inner} ${cy + inner} ${cx - rx} ${cy}`,
    `Q ${cx - inner} ${cy - inner} ${cx} ${cy - ry}`,
    'Z',
  ].join(' ')
}

export function SparkleIcon({ palette = 'yellow', size = 200 }) {
  const p = PALETTES[palette] ?? PALETTES.purple

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main star: offset center toward upper-left for the gem highlight */}
        <radialGradient id={gMain} cx="38%" cy="36%" r="62%">
          <stop offset="0%"   stopColor={p.highlight} />
          <stop offset="30%"  stopColor={p.inner} />
          <stop offset="65%"  stopColor={p.mid} />
          <stop offset="100%" stopColor={p.outer} />
        </radialGradient>
        <radialGradient id={gSmall} cx="38%" cy="36%" r="62%">
          <stop offset="0%"   stopColor={p.highlight} />
          <stop offset="40%"  stopColor={p.inner} />
          <stop offset="100%" stopColor={p.mid} />
        </radialGradient>
      </defs>

      {/* Main large star */}
      <path
        d={starPath(44, 56, 30, 38, 12)}
        fill={`url(#${gMain})`}
      />

      {/* Companion star — upper right */}
      <path
        d={starPath(74, 27, 12, 15, 4.5)}
        fill={`url(#${gSmall})`}
      />

      {/* Tiny sparkles */}
      <path d={starPath(19, 21,  5,  6.5, 2)}   fill={p.mid} />
      <path d={starPath(87, 47,  4,  5,   1.5)}  fill={p.inner} />
      <path d={starPath(16, 81,  4,  5,   1.5)}  fill={p.mid} />
      <path d={starPath(82, 79,  3,  3.5, 1)}    fill={p.inner} />
    </svg>
  )
}
