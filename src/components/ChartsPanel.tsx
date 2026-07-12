import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronsUp,
  ChevronUp,
  Minus,
  Plus,
  Link2,
  LayoutGrid,
  Square,
  Rows4,
  Rows2,
  Play,
  Pause,
  RotateCw,
  Repeat,
  Settings,
  Download,
  Upload,
  ArrowUpDown,
} from "lucide-react";
import { Button, IconButton, Radio, TextField } from "./primitives";
import { Heatmap, ColorLegend, genSeries } from "./heatmap";
import type { ScanRecord } from "./types";

type ScanPattern = "rasterized" | "spiral";
type ScanStatus = "idle" | "scanning" | "paused";
type Tab = "charts" | "trace";
type Density = "grid" | "single";

function TraceChart({ reveal, seedA, seedB }: { reveal: number; seedA: number; seedB: number }) {
  const n = 13;
  const seriesA = useMemo(() => genSeries(seedA, n, 1000), [seedA]);
  const seriesB = useMemo(() => genSeries(seedB, n, 1000), [seedB]);
  const toPoints = (arr: number[]) =>
    arr.map((v, i) => `${(i / (arr.length - 1)) * 100},${100 - (v / 1000) * 100}`).join(" ");
  const dashStyle = { strokeDasharray: 100, strokeDashoffset: 100 - reveal } as const;
  return (
    <div className="flex h-full flex-col gap-1">
      <div className="flex min-h-0 flex-1">
        <div className="flex flex-col justify-between py-1 pr-1 text-[10px] text-text-subtle">
          <span>1000</span>
          <span>500</span>
          <span>0</span>
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <polyline points={toPoints(seriesA)} fill="none" stroke="#94a3b8" strokeWidth="1" pathLength={100} vectorEffect="non-scaling-stroke" style={dashStyle} />
          <polyline points={toPoints(seriesB)} fill="none" stroke="#0053aa" strokeWidth="1" pathLength={100} vectorEffect="non-scaling-stroke" style={dashStyle} />
        </svg>
      </div>
      <div className="flex justify-between pl-5 text-[9px] text-text-subtle">
        {Array.from({ length: n }, (_, i) => (
          <span key={i}>{`${String(i).padStart(2, "0")}:00`}</span>
        ))}
      </div>
    </div>
  );
}

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between">
      <TextField
        readOnly
        value="Channel"
        className="w-[135px]"
        suffixIcon={<ChevronUp size={12} className="rotate-180 text-text-subtle" />}
      />
      <div className="flex items-center gap-2 text-xs text-text-subtle">
        <label className="flex items-center gap-0.5">
          <input type="checkbox" className="size-3" /> X
        </label>
        <label className="flex items-center gap-0.5">
          <input type="checkbox" className="size-3" /> Y
        </label>
      </div>
    </div>
  );
}

function useLinkedPair(initialA: number, initialB: number) {
  const [a, setAState] = useState(initialA);
  const [b, setBState] = useState(initialB);
  const [linked, setLinked] = useState(true);
  const ratioRef = useRef(initialA !== 0 ? initialB / initialA : 1);

  const setA = (v: number) => {
    setAState(v);
    if (linked) setBState(Math.round(v * ratioRef.current));
  };
  const setB = (v: number) => {
    setBState(v);
  };
  const toggleLink = () => {
    setLinked((prev) => {
      const next = !prev;
      if (next) ratioRef.current = a !== 0 ? b / a : 1;
      return next;
    });
  };

  return { a, b, linked, setA, setB, toggleLink };
}

type LinkedPair = ReturnType<typeof useLinkedPair>;

function RatioField({ label, pair }: { label: string; pair: LinkedPair }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-xs font-medium text-text-subtle">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <TextField
          value={String(pair.a)}
          onChange={(e) => pair.setA(Number(e.target.value) || 0)}
          className="min-w-0 flex-1"
        />
        <button onClick={pair.toggleLink} className={`shrink-0 ${pair.linked ? "text-primary-base" : "text-text-subtle"}`}>
          <Link2 size={16} />
        </button>
        <TextField
          value={String(pair.b)}
          onChange={(e) => pair.setB(Number(e.target.value) || 0)}
          disabled={pair.linked}
          className={`min-w-0 flex-1 ${pair.linked ? "text-text-disabled" : ""}`}
        />
      </div>
    </div>
  );
}

export function ChartsPanel({ onScanComplete }: { onScanComplete: (record: ScanRecord) => void }) {
  const [tab, setTab] = useState<Tab>("charts");
  const [density, setDensity] = useState<Density>("grid");
  const [pattern, setPattern] = useState<ScanPattern>("rasterized");
  const [scanDirection, setScanDirection] = useState<"download" | "upload" | "swap">("download");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scanned, setScanned] = useState(false);
  const [reveal, setReveal] = useState(0);
  const [seed, setSeed] = useState(1);
  const loggedRef = useRef(false);
  const speedPair = useLinkedPair(99999, 99999);
  const sizePair = useLinkedPair(999, 999);
  const pixelsPair = useLinkedPair(9999, 9999);

  useEffect(() => {
    if (status !== "scanning") return;
    const id = setInterval(() => {
      setReveal((p) => Math.min(100, p + 3));
    }, 90);
    return () => clearInterval(id);
  }, [status]);

  const logScan = () => {
    if (loggedRef.current) return;
    loggedRef.current = true;
    onScanComplete({ id: Date.now(), seed, x: 0, y: 0, timestamp: new Date(), note: "" });
  };

  useEffect(() => {
    if (status === "scanning" && reveal >= 100) logScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, reveal]);

  const panelCount = tab === "charts" ? (density === "grid" ? 4 : 1) : density === "grid" ? 4 : 2;
  const panels = Array.from({ length: panelCount }, (_, i) => i);

  const gridClass =
    tab === "charts"
      ? density === "grid"
        ? "grid grid-cols-2 grid-rows-2 gap-4"
        : "grid grid-cols-1 grid-rows-1 gap-4"
      : density === "grid"
        ? "grid grid-cols-1 grid-rows-4 gap-3"
        : "grid grid-cols-1 grid-rows-2 gap-3";

  const startScan = () => {
    setScanned(true);
    setReveal(0);
    setSeed(Date.now());
    loggedRef.current = false;
    setStatus("scanning");
  };
  const restart = () => {
    if (scanned && reveal > 0) logScan();
    setStatus("idle");
    setScanned(false);
    setReveal(0);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex gap-2">
        <div className="flex flex-1 items-start bg-surface-1 p-1">
          <Button variant="ghost" active={tab === "charts"} className="flex-1" onClick={() => setTab("charts")}>
            Charts
          </Button>
          <Button variant="ghost" active={tab === "trace"} className="flex-1" onClick={() => setTab("trace")}>
            Line trace
          </Button>
        </div>
        <div className="flex shrink-0 bg-surface-1 p-1">
          <IconButton className="size-7" active={density === "grid"} onClick={() => setDensity("grid")}>
            {tab === "charts" ? <LayoutGrid size={16} /> : <Rows4 size={16} />}
          </IconButton>
          <IconButton className="size-7" active={density === "single"} onClick={() => setDensity("single")}>
            {tab === "charts" ? <Square size={16} /> : <Rows2 size={16} />}
          </IconButton>
        </div>
      </div>

      <div className={`min-h-0 flex-1 ${gridClass}`}>
        {panels.map((i) => (
          <div key={i} className="flex min-h-0 flex-col gap-2">
            <ChannelHeader />
            <div className="flex min-h-0 flex-1 gap-2">
              {!scanned ? (
                <div className="flex flex-1 items-center justify-center border border-dashed border-border-default text-xl font-medium text-text-disabled">
                  No data to show
                </div>
              ) : tab === "charts" ? (
                <div className="min-w-0 flex-1 overflow-hidden border border-border-default">
                  <Heatmap reveal={reveal} seed={i * 97 + 11} />
                </div>
              ) : (
                <div className="min-w-0 flex-1 overflow-hidden border border-border-default p-2">
                  <TraceChart reveal={reveal} seedA={i * 53 + 3} seedB={i * 53 + 29} />
                </div>
              )}
              {scanned && tab === "charts" && <ColorLegend />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-border-subtle pt-3">
        <div className="flex min-w-0 gap-2">
          {/* Tip */}
          <div className="flex min-w-0 flex-1 gap-3 pl-4">
            <div className="flex items-center px-3.5">
              <div className="h-21 w-9 rounded-sm bg-gradient-to-b from-neutral-300 to-neutral-500" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-center gap-0.5">
                <span className="text-xs font-semibold text-text-subtle">Tip</span>
                <Settings size={14} className="text-text-subtle" />
              </div>
              <div className="flex flex-col gap-0.5">
                <button className="flex h-5 items-center gap-0.5 border border-button-secondary-outline bg-surface-0 px-1 text-xs font-semibold text-text-subtle">
                  <ChevronsUp size={12} /> Lift head
                </button>
                <button className="flex h-5 items-center gap-0.5 border border-button-secondary-outline bg-surface-0 px-1 text-xs font-semibold text-text-subtle">
                  <ChevronUp size={12} /> Retract
                </button>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex gap-1.5">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-center text-xs font-medium text-text-subtle">Setpoint</span>
                  <div className="flex h-7 items-center">
                    <div className="flex size-7 shrink-0 items-center justify-center border-b border-border-default bg-surface-card-quiet">
                      <Minus size={12} />
                    </div>
                    <div className="flex h-7 flex-1 items-center justify-center border-b border-border-default bg-surface-1 px-3 text-xs font-medium">
                      99.99%
                    </div>
                    <div className="flex size-7 shrink-0 items-center justify-center border-b border-border-default bg-surface-card-quiet">
                      <Plus size={12} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-center text-xs font-medium text-text-subtle">Gain</span>
                  <TextField readOnly value="9.999" className="w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-medium text-text-subtle">
                  <span>Speed</span>
                  <span>Bwd?</span>
                </div>
                <div className="flex items-center gap-1">
                  <TextField
                    value={String(speedPair.a)}
                    onChange={(e) => speedPair.setA(Number(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <button
                    onClick={speedPair.toggleLink}
                    className={`shrink-0 ${speedPair.linked ? "text-primary-base" : "text-text-subtle"}`}
                  >
                    <Link2 size={16} />
                  </button>
                  <TextField
                    value={String(speedPair.b)}
                    onChange={(e) => speedPair.setB(Number(e.target.value) || 0)}
                    disabled={speedPair.linked}
                    className={`flex-1 ${speedPair.linked ? "text-text-disabled" : ""}`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-text-subtle">Line rate</span>
                <span className="font-semibold text-text-default">10Hz</span>
              </div>
            </div>
          </div>

          {/* Scan pattern + Center/Size/Pixels/Angle */}
          <div className="flex min-w-0 flex-1 gap-2">
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-text-subtle">Scan pattern</span>
              <div className="flex flex-col gap-1">
                <div className="flex h-5 items-center justify-between">
                  <Radio label="Rasterized" checked={pattern === "rasterized"} onChange={() => setPattern("rasterized")} />
                  <div className="flex items-center">
                    {[
                      { key: "download", Icon: Download },
                      { key: "upload", Icon: Upload },
                      { key: "swap", Icon: ArrowUpDown },
                    ].map(({ key, Icon }, i, arr) => (
                      <button
                        key={key}
                        onClick={() => setScanDirection(key as typeof scanDirection)}
                        className={`-mr-px flex size-5 items-center justify-center border bg-surface-0 text-text-subtle last:mr-0 ${
                          scanDirection === key ? "z-10 border-primary-base" : "border-border-default"
                        }`}
                        style={{ zIndex: arr.length - i }}
                      >
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
                <Radio label="Spiral" checked={pattern === "spiral"} onChange={() => setPattern("spiral")} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex gap-1.5">
                <span className="font-medium text-text-subtle">Time per image</span>
                <span className="font-semibold text-text-default">2 mins</span>
              </div>
              <div className="flex gap-1.5">
                <span className="font-medium text-text-subtle">Time remaining</span>
                <span className="font-semibold text-text-default">
                  {status === "idle" ? "1min 20 sec" : `${Math.max(0, Math.round((100 - reveal) * 0.8))} sec`}
                </span>
              </div>
            </div>
          </div>

          {/* Center/Size/Pixels/Angle */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-xs font-medium text-text-subtle">Center</span>
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <TextField readOnly value="9.999999" className="min-w-0 flex-1" />
                <TextField readOnly value="9.999999" className="min-w-0 flex-1" />
              </div>
            </div>
            <RatioField label="Size" pair={sizePair} />
            <RatioField label="Pixels" pair={pixelsPair} />
            <div className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-xs font-medium text-text-subtle">Angle</span>
              <TextField readOnly value="9.999999" className="min-w-0 flex-1" />
            </div>
          </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" disabled={status !== "idle"}>
            Engage tip
          </Button>
          <div className="flex flex-1 items-center gap-2">
            {status === "idle" ? (
              <Button variant="primary" className="flex-1 gap-1" onClick={startScan}>
                <Play size={16} /> Scan
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  className="flex-1 gap-1"
                  onClick={() => setStatus(status === "scanning" ? "paused" : "scanning")}
                >
                  {status === "scanning" ? (
                    <>
                      <Pause size={14} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={14} /> Continue
                    </>
                  )}
                </Button>
                <Button variant="primary" className="flex-1 gap-1" onClick={restart}>
                  <RotateCw size={14} /> Restart
                </Button>
              </>
            )}
            <IconButton className="size-7">
              <Repeat size={20} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
