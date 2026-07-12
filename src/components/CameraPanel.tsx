import { useState, type ChangeEvent } from "react";
import {
  Locate,
  LocateFixed,
  Save,
  Copy,
  Settings,
  Tag,
  FlaskConical,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { Button, Card, CardHeader, Radio, SelectField, TextField, ToggleItem } from "./primitives";
import { Heatmap, mulberry32 } from "./heatmap";
import type { ScanRecord } from "./types";

type CoordSystem = "absolute" | "relative" | "custom";

function CoordinateControls({
  system,
  setSystem,
  edited,
  onEdit,
  locationLabel,
  customLabel,
}: {
  system: CoordSystem;
  setSystem: (s: CoordSystem) => void;
  edited: boolean;
  onEdit: () => void;
  locationLabel: string;
  customLabel: string;
}) {
  const [locX, setLocX] = useState("999.999999999..");
  const [locY, setLocY] = useState("999.999999999..");

  const handleLocChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    onEdit();
  };

  return (
    <div className="flex w-full gap-3">
      <div className="flex w-34 shrink-0 flex-col gap-2">
        <span className="text-xs font-medium text-text-subtle">Coordinate system</span>
        <div className="flex flex-col gap-2">
          <Radio label="Absolute" checked={system === "absolute"} onChange={() => setSystem("absolute")} />
          <Radio label="Relative" checked={system === "relative"} onChange={() => setSystem("relative")} />
          <Radio label="Custom" checked={system === "custom"} onChange={() => setSystem("custom")} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {system === "relative" && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-text-subtle">Origin</span>
            <div className="flex items-center gap-2">
              <TextField readOnly value="X 0" className="flex-1" />
              <TextField readOnly value="Y 2" className="flex-1" />
              <button className="flex size-7 shrink-0 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        )}
        {system === "custom" && (
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-xs font-medium text-text-subtle">Custom coordinate</span>
              <SelectField value={edited ? "New unsaved location*" : customLabel} warn={edited} className="w-full" />
            </div>
            <button className="flex size-7 shrink-0 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
              <Pencil size={16} />
            </button>
            <button className="flex size-7 shrink-0 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
              <Settings size={16} />
            </button>
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-xs font-medium text-text-subtle">Location</span>
          <SelectField value={edited ? "New unsaved location*" : locationLabel} warn={edited} className="w-full" />
          <div className="flex gap-2">
            <TextField value={locX} onChange={handleLocChange(setLocX)} className="min-w-0 flex-1" />
            <TextField value={locY} onChange={handleLocChange(setLocY)} className="min-w-0 flex-1" />
          </div>
          <div className="flex gap-2 text-xs font-medium text-text-subtle">
            <div className="flex flex-1 gap-1.5">
              <span>X</span>
              <span>999.99999</span>
            </div>
            <div className="flex flex-1 gap-1.5">
              <span>Y</span>
              <span>999.99999</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CameraPanel({ scans }: { scans: ScanRecord[] }) {
  const [view, setView] = useState<"camera" | "map">("camera");
  const [brightness, setBrightness] = useState(60);
  const [zoom] = useState(70);
  const [led, setLed] = useState(false);
  const [coordSystem, setCoordSystem] = useState<CoordSystem>("absolute");
  const [locationEdited, setLocationEdited] = useState(false);
  const [moving, setMoving] = useState(false);
  const [savedLocationCount, setSavedLocationCount] = useState(0);
  const locationLabel = savedLocationCount > 0 ? `New Location ${savedLocationCount}` : "Location names";
  const customLabel = savedLocationCount > 0 ? `New Location ${savedLocationCount}` : "N38A0020LA26";

  return (
    <>
      <Card className="flex-1 overflow-auto">
        <CardHeader title="Rough" />
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
          <div className="flex items-start gap-1 bg-surface-1 p-1">
            <Button variant="ghost" active={view === "camera"} className="flex-1" onClick={() => setView("camera")}>
              Camera view
            </Button>
            <Button variant="ghost" active={view === "map"} className="flex-1" onClick={() => setView("map")}>
              Scanner map
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex cursor-pointer items-center gap-1">
                <button className="flex size-5 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
                  <Locate size={14} />
                </button>
                <button className="flex size-5 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
                  <LocateFixed size={14} />
                </button>
              </div>
              <div className="flex items-center">
                <IconRow />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative aspect-square flex-1 overflow-hidden bg-[#8a7a68]">
                {view === "camera" ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#a3927d] to-[#5c4f42]" />
                    <div className="absolute top-1/2 left-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rotate-[20deg] bg-white/90 [clip-path:polygon(0%_35%,70%_35%,100%_50%,70%_65%,0%_65%)]" />
                    <div className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-red-500/70" />
                    <div className="absolute bottom-4 left-2 flex items-center gap-2 text-[10px] font-semibold text-text-subtle">
                      <span className="inline-block h-px w-6 bg-text-subtle" />
                      50um
                    </div>
                    <div className="absolute right-3 bottom-3 flex size-16 items-center justify-center rounded-full bg-black/10">
                      <div className="flex size-16 flex-col items-center justify-between p-0.5">
                        <ChevronUp size={14} className="text-text-subtle" />
                        <div className="flex w-full items-center justify-between">
                          <ChevronLeft size={14} className="text-text-subtle" />
                          <ChevronRight size={14} className="text-text-subtle" />
                        </div>
                        <ChevronDown size={14} className="text-text-subtle" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="absolute inset-0 bg-surface-0"
                    style={{
                      backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
                    {scans.slice(0, 5).map((s) => {
                      const rand = mulberry32(s.id);
                      const left = 8 + rand() * 62;
                      const top = 8 + rand() * 62;
                      const rotate = (rand() - 0.5) * 10;
                      return (
                        <div
                          key={s.id}
                          className="absolute size-1/5 overflow-hidden shadow-md"
                          style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${rotate}deg)` }}
                        >
                          <Heatmap reveal={100} seed={s.seed} cols={12} rows={12} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex h-full w-5 flex-col items-center gap-2">
                <button className="flex size-5 shrink-0 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
                  <Tag size={14} />
                </button>
                <button className="flex size-5 shrink-0 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
                  <FlaskConical size={14} />
                </button>
                <div className="relative w-[7px] flex-1 rounded-[1px] bg-surface-card-quiet">
                  <div className="absolute inset-x-0 bottom-0 h-3/5 rounded-[1px] bg-primary-base" />
                  <div className="absolute left-1/2 h-3 w-3.5 -translate-x-1/2 translate-y-1/2 rounded-sm border border-border-strong bg-white shadow-sm" style={{ bottom: "60%" }} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-text-subtle">Brightness</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={brightness}
                    onChange={(e) => setBrightness(+e.target.value)}
                    className="w-30 accent-primary-base"
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-text-subtle">Zoom</span>
                  <TextField readOnly value={`${zoom}%`} className="w-16" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ToggleItem label="" checked={led} onChange={setLed} />
                  <span className={`text-xs font-semibold ${led ? "text-text-subtle" : "text-text-disabled"}`}>
                    LED
                  </span>
                  <input type="range" disabled={!led} min={0} max={100} className="w-30 accent-gray-400" />
                </div>
                <button className="flex size-5 items-center justify-center bg-surface-1 text-text-subtle">
                  <Settings size={14} />
                </button>
              </div>
            </div>

            <CoordinateControls
              system={coordSystem}
              setSystem={setCoordSystem}
              edited={locationEdited}
              onEdit={() => setLocationEdited(true)}
              locationLabel={locationLabel}
              customLabel={customLabel}
            />
          </div>

          <div className="mt-auto">
            {moving ? (
              <Button
                variant="danger"
                className="w-full"
                onClick={() => {
                  setMoving(false);
                  setLocationEdited(false);
                  setSavedLocationCount((c) => c + 1);
                }}
              >
                Stop movement
              </Button>
            ) : locationEdited ? (
              <Button variant="primary" className="w-full" onClick={() => setMoving(true)}>
                Move to target
              </Button>
            ) : (
              <Button variant="secondary" className="w-full" disabled>
                Move
              </Button>
            )}
          </div>
        </div>
      </Card>

      <BeamLevelingCard />
    </>
  );
}

function IconRow() {
  return (
    <div className="flex items-center">
      <button className="-mr-px flex size-5 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
        <Save size={14} />
      </button>
      <button className="-mr-px flex size-5 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
        <Copy size={14} />
      </button>
      <button className="flex size-5 items-center justify-center border border-border-default bg-surface-0 text-text-subtle">
        <Settings size={14} />
      </button>
    </div>
  );
}

function BeamLevelingCard() {
  return (
    <Card className="shrink-0">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <span className="text-xs font-medium text-text-light">Beam leveling</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <span className="relative flex h-5 w-3.5 items-center justify-center border border-green-500 bg-white">
                  <span className="size-2.5 rounded-full border border-white bg-green-600" />
                </span>
                <span className="relative flex h-5 w-3.5 items-center justify-center border border-green-500 bg-white">
                  <span className="size-2.5 rounded-full border border-white bg-green-600" />
                </span>
              </div>
              <Button variant="secondary" className="h-5 px-1">
                Level
              </Button>
              <Button variant="secondary" className="h-5 px-1">
                Advanced
              </Button>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1.5">
            <span className="text-xs font-medium text-text-light">Optics position</span>
            <span className="text-xs font-medium text-text-subtle">X: 9.9999 um  Y:9.9999um</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium text-text-light">Tip coordinates</span>
            <span className="text-xs font-medium text-text-subtle">X: 9.9999 um  Y:9.9999um</span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium text-text-light">Tip distance to sample</span>
            <span className="text-xs font-medium text-text-subtle">X: 9.9999 um  Y:9.9999um</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
