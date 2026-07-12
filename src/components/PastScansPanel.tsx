import { useState, type ReactNode } from "react";
import { Copy, Pencil, Save, Settings } from "lucide-react";
import { Card, CardHeader } from "./primitives";
import { Heatmap, SpectrumChart } from "./heatmap";
import type { PastSpectrumRecord, ScanRecord } from "./types";

function formatTimestamp(d: Date) {
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(2, "0");
  return `${day} ${month} ${year}, at ${hh}:${mm}:${ss}${ms}`;
}

type HistoryRecord = ScanRecord | PastSpectrumRecord;

function HistoryEntry({
  record,
  thumbnail,
  onNoteChange,
}: {
  record: HistoryRecord;
  thumbnail: ReactNode;
  onNoteChange: (note: string) => void;
}) {
  const [editing, setEditing] = useState(!record.note);
  const [draft, setDraft] = useState(record.note);

  const save = () => {
    onNoteChange(draft.trim());
    setEditing(false);
  };

  return (
    <div className="group flex shrink-0 gap-3">
      <div className="relative h-[114px] w-[201px] shrink-0 overflow-hidden bg-surface-0">
        {thumbnail}
        <div className="absolute top-1 right-1 flex items-center gap-1">
          <button className="flex size-5 items-center justify-center bg-black/30 text-white">
            <Copy size={12} />
          </button>
          <button className="flex size-5 items-center justify-center bg-black/30 text-white">
            <Settings size={12} />
          </button>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1">
        {editing ? (
          <div className="flex items-center gap-2 border-b border-border-default px-1 py-1.5">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder="Enter note"
              className="min-w-0 flex-1 bg-transparent text-xs text-text-default outline-none placeholder:text-text-disabled"
            />
            <button onClick={save} className="shrink-0 text-text-subtle">
              <Save size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-text-default">{record.note}</p>
            <button
              onClick={() => setEditing(true)}
              className="shrink-0 text-text-subtle opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Pencil size={12} />
            </button>
          </div>
        )}

        <div className="text-xs">
          <span className="text-text-default">
            <span className="font-semibold">X:</span> {record.x.toFixed(3)} um{"  "}
            <span className="font-semibold">Y:</span> {record.y.toFixed(3)} um
          </span>
          <div className="text-text-light">{formatTimestamp(record.timestamp)}</div>
        </div>
      </div>
    </div>
  );
}

export function PastScansPanel({
  scans,
  spectrums,
  onUpdateScanNote,
  onUpdateSpectrumNote,
}: {
  scans: ScanRecord[];
  spectrums: PastSpectrumRecord[];
  onUpdateScanNote: (id: number, note: string) => void;
  onUpdateSpectrumNote: (id: number, note: string) => void;
}) {
  const [tab, setTab] = useState<"scans" | "spectrum">("scans");
  const records = tab === "scans" ? scans : spectrums;

  return (
    <Card className="min-h-0 flex-1">
      <CardHeader title="History" />
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <div className="flex shrink-0 items-start bg-surface-1 p-1">
          <button
            onClick={() => setTab("scans")}
            className={`flex h-7 flex-1 items-center justify-center px-2 py-1 text-xs font-semibold ${
              tab === "scans"
                ? "border border-border-default bg-surface-0 text-text-default"
                : "text-text-light"
            }`}
          >
            Past scans ({scans.length})
          </button>
          <button
            onClick={() => setTab("spectrum")}
            className={`flex h-7 flex-1 items-center justify-center px-2 py-1 text-xs font-semibold ${
              tab === "spectrum"
                ? "border border-border-default bg-surface-0 text-text-default"
                : "text-text-light"
            }`}
          >
            Past spectrums ({spectrums.length})
          </button>
        </div>

        {records.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center border border-dashed border-border-default">
            <span className="text-xl font-medium text-text-disabled">
              {tab === "scans" ? "No scans found" : "No spectra found"}
            </span>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
            {records.map((record) =>
              tab === "scans" ? (
                <HistoryEntry
                  key={record.id}
                  record={record}
                  thumbnail={<Heatmap reveal={100} seed={record.seed} />}
                  onNoteChange={(note) => onUpdateScanNote(record.id, note)}
                />
              ) : (
                <HistoryEntry
                  key={record.id}
                  record={record}
                  thumbnail={
                    <div className="h-full w-full p-2">
                      <SpectrumChart seed={record.seed} />
                    </div>
                  }
                  onNoteChange={(note) => onUpdateSpectrumNote(record.id, note)}
                />
              ),
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
