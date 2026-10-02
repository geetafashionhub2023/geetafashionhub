/**
 * Ornamental textile-swatch artwork shown wherever a product or category has no
 * photo yet. Deterministic per seed, so each item keeps the same look.
 */

const palettes = [
  { bg1: "#6b1426", bg2: "#3f0914", ink: "#e1c58a", soft: "#8a1f33" }, // maroon & gold
  { bg1: "#f4e6cf", bg2: "#e7d2ae", ink: "#8a1f33", soft: "#d9bd8a" }, // ivory & wine
  { bg1: "#4a2a1f", bg2: "#2e1912", ink: "#e1c58a", soft: "#5c3627" }, // dark brown
  { bg1: "#f2d3cc", bg2: "#e6b9b0", ink: "#7a1a2c", soft: "#ebc4bc" }, // blush (logo pink)
  { bg1: "#8a1f33", bg2: "#5e1020", ink: "#f2d3cc", soft: "#a2324a" }, // burgundy & blush
  { bg1: "#e3a93b", bg2: "#c98a22", ink: "#5e1020", soft: "#eab95a" }, // saffron
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function motifSvg(seed: string): string {
  const h = hash(seed);
  const p = palettes[h % palettes.length];
  const petals = 8 + ((h >> 3) % 3) * 4; // 8, 12 or 16
  const petal = Array.from({ length: petals }, (_, i) =>
    `<g transform="rotate(${(360 / petals) * i})"><path d="M0 -20C12 -34 12 -50 0 -62C-12 -50 -12 -34 0 -20Z"/><path d="M0 -66C6 -72 6 -78 0 -84C-6 -78 -6 -72 0 -66Z" stroke-opacity=".6"/><circle cy="-40" r="2" fill="${p.ink}" stroke="none"/></g>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg1}"/><stop offset="1" stop-color="${p.bg2}"/></linearGradient><pattern id="b" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="18" cy="18" r="1.6" fill="${p.ink}" opacity=".35"/><path d="M18 9c2 2 3 4 3 6s-1 3-3 3-3-1-3-3 1-4 3-6z" fill="${p.soft}" opacity=".55"/></pattern></defs><rect width="300" height="400" fill="url(#g)"/><rect width="300" height="400" fill="url(#b)"/><rect x="14" y="14" width="272" height="372" fill="none" stroke="${p.ink}" stroke-opacity=".45" stroke-width=".8"/><rect x="20" y="20" width="260" height="360" fill="none" stroke="${p.ink}" stroke-opacity=".25" stroke-width=".6" stroke-dasharray="2 4"/><g transform="translate(150 200)" fill="none" stroke="${p.ink}" stroke-width="1.1" opacity=".9"><circle r="86" stroke-opacity=".35"/><circle r="64" stroke-opacity=".5"/>${petal}<circle r="16"/><circle r="5" fill="${p.ink}" stroke="none"/></g></svg>`;
}
