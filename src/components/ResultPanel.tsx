import { useState } from "react";
import { Save, Copy, Info, Settings, ChevronDown, Locate, RotateCcw } from "lucide-react";
import { Button, Card, CardHeader, Checkbox, Divider, TextField, ToggleItem } from "./primitives";
import { SpectrumChart } from "./heatmap";
import type { PastSpectrumRecord } from "./types";

export function ResultPanel({ onSpectrumComplete }: { onSpectrumComplete: (record: PastSpectrumRecord) => void }) {
  const [normalized, setNormalized] = useState(true);
  const [average, setAverage] = useState(false);
  const [laserOn, setLaserOn] = useState(true);
  const [loop, setLoop] = useState(false);
  const [seed, setSeed] = useState(1);
  const [hasData, setHasData] = useState(false);

  const takeSpectrum = () => {
    const newSeed = Date.now();
    setSeed(newSeed);
    setHasData(true);
    onSpectrumComplete({ id: newSeed, seed: newSeed, x: 0, y: 0, timestamp: new Date(), note: "" });
  };

  return (
    <Card>
      <CardHeader title="Results" />
      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ToggleItem label="Normalized" checked={normalized} onChange={setNormalized} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-text-subtle">Smoothing</span>
              <TextField readOnly value="7" className="h-5 w-11" suffixIcon={<ChevronDown size={12} />} />
              <span className="text-[10px] font-medium text-text-subtle">Resolution</span>
              <TextField readOnly value="7" className="h-5 w-11" />
            </div>
          </div>
          <div className="flex items-center">
            {[Save, Copy, Info, Settings].map((Icon, i) => (
              <button
                key={i}
                className="-mr-px flex size-5 items-center justify-center border border-border-default bg-surface-0 text-text-subtle last:mr-0"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-64 items-center justify-center border border-dashed border-border-default">
          {hasData ? (
            <div className="h-full w-full p-2">
              <SpectrumChart seed={seed} />
            </div>
          ) : (
            <span className="text-xl font-medium text-text-disabled">No data to show</span>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-xs font-medium text-text-subtle">
              Time per spectrum (sec): <span className="font-semibold">1234</span>
            </p>
            <Checkbox label="Average" checked={average} onChange={() => setAverage((v) => !v)} />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium text-text-subtle">Range (1/cm)</span>
            <div className="flex gap-1">
              <TextField readOnly value="1234" className="flex-1" />
              <TextField readOnly value="1234" className="flex-1" />
            </div>
          </div>
        </div>

        <Divider label="Laser (759 - 1923)" />

        <div className="flex flex-col gap-1">
          <div className="flex gap-3">
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs font-medium text-text-subtle">Laser</span>
              <Button variant={laserOn ? "primary" : "danger"} className="w-24" onClick={() => setLaserOn((v) => !v)}>
                Power {laserOn ? "ON" : "OFF"}
              </Button>
            </div>
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs font-medium text-text-subtle">Wavenumber</span>
              <TextField readOnly value="1234" className="w-24 justify-end text-right" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs font-medium text-text-subtle">Intensity</span>
              <TextField readOnly value="20%" className="w-24" suffixIcon={<ChevronDown size={16} />} />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs font-medium text-text-subtle">PiFM Mode</span>
              <TextField readOnly value="Standard" className="w-24" suffixIcon={<ChevronDown size={16} />} />
            </div>
          </div>
        </div>

        <Divider label="Focus data zones?" />

        <div className="flex gap-2.5">
          <div className="flex w-53 items-center gap-1 border border-border-default bg-surface-0 px-2 py-1">
            <Locate size={16} className="text-text-subtle" />
            <span className="flex-1 px-0.5 text-xs font-medium text-text-subtle">Line</span>
            <ChevronDown size={16} className="text-text-subtle" />
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs font-medium text-text-subtle">Spacing</span>
              <TextField readOnly value="1234" className="w-24 justify-end text-right" />
            </div>
            <button className="flex size-7 items-center justify-center text-primary-base">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex h-7 items-center justify-end">
            <ToggleItem label="Loop spectrum sweep" checked={loop} onChange={setLoop} />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1">
              Auto power
            </Button>
            <Button variant="primary" className="flex-1" onClick={takeSpectrum}>
              Take spectrum
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
