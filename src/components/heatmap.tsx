import { useMemo } from "react";

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STOPS: [number, number, number][] = [
  [252, 245, 217],
  [204, 151, 109],
  [81, 87, 128],
  [9, 8, 29],
];

export function colorScale(v: number) {
  const clamped = Math.min(1, Math.max(0, v));
  const segments = STOPS.length - 1;
  const scaled = clamped * segments;
  const idx = Math.min(segments - 1, Math.floor(scaled));
  const t = scaled - idx;
  const [r1, g1, b1] = STOPS[idx];
  const [r2, g2, b2] = STOPS[idx + 1];
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

export function genGrid(seed: number, cols: number, rows: number) {
  const rand = mulberry32(seed);
  const coarse = 6;
  const base = Array.from({ length: coarse * coarse }, () => rand());
  const sample = (x: number, y: number) => {
    const cx = (x / cols) * (coarse - 1);
    const cy = (y / rows) * (coarse - 1);
    const x0 = Math.floor(cx);
    const y0 = Math.floor(cy);
    const x1 = Math.min(coarse - 1, x0 + 1);
    const y1 = Math.min(coarse - 1, y0 + 1);
    const tx = cx - x0;
    const ty = cy - y0;
    const v00 = base[y0 * coarse + x0];
    const v10 = base[y0 * coarse + x1];
    const v01 = base[y1 * coarse + x0];
    const v11 = base[y1 * coarse + x1];
    const top = v00 + (v10 - v00) * tx;
    const bot = v01 + (v11 - v01) * tx;
    return top + (bot - top) * ty;
  };
  const cells: number[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push(Math.min(1, Math.max(0, sample(x, y) + (rand() - 0.5) * 0.15)));
    }
  }
  return cells;
}

export function genSeries(seed: number, n: number, max: number) {
  const rand = mulberry32(seed);
  let v = rand() * max;
  return Array.from({ length: n }, () => {
    v = Math.min(max, Math.max(0, v + (rand() - 0.5) * max * 0.6));
    return v;
  });
}

export function Heatmap({ reveal, seed, cols = 24, rows = 18 }: { reveal: number; seed: number; cols?: number; rows?: number }) {
  const cells = useMemo(() => genGrid(seed, cols, rows), [seed, cols, rows]);
  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-0">
      <div
        className="grid h-full w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {cells.map((v, i) => (
          <div key={i} style={{ background: colorScale(v) }} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-white" style={{ height: `${100 - reveal}%` }} />
    </div>
  );
}

export function ColorLegend() {
  return (
    <div className="flex flex-col items-center justify-between py-1">
      <span className="text-xs text-text-default">99</span>
      <div
        className="w-4 flex-1"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgb(252,245,217) 0%, rgb(204,151,109) 50%, rgb(81,87,128) 76%, rgb(9,8,29) 100%)",
        }}
      />
      <span className="text-xs text-text-default">99</span>
    </div>
  );
}

export function SpectrumChart({ seed }: { seed: number }) {
  const values = useMemo(() => genSeries(seed, 8, 100), [seed]);
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - v}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <polyline points={points} fill="none" stroke="#0053aa" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {values.map((v, i) => (
        <circle
          key={i}
          cx={(i / (values.length - 1)) * 100}
          cy={100 - v}
          r="1.4"
          fill="white"
          stroke="#0053aa"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
