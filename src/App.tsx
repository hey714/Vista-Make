import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { Toolbar } from "./components/Toolbar";
import { CameraPanel } from "./components/CameraPanel";
import { ChartsPanel } from "./components/ChartsPanel";
import { ResultPanel } from "./components/ResultPanel";
import { PastScansPanel } from "./components/PastScansPanel";
import { Card, CardHeader } from "./components/primitives";
import type { PastSpectrumRecord, ScanRecord } from "./components/types";

function App() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [spectrums, setSpectrums] = useState<PastSpectrumRecord[]>([]);

  const addScan = (record: ScanRecord) => setScans((prev) => [record, ...prev]);
  const updateScanNote = (id: number, note: string) =>
    setScans((prev) => prev.map((s) => (s.id === id ? { ...s, note } : s)));

  const addSpectrum = (record: PastSpectrumRecord) => setSpectrums((prev) => [record, ...prev]);
  const updateSpectrumNote = (id: number, note: string) =>
    setSpectrums((prev) => prev.map((s) => (s.id === id ? { ...s, note } : s)));

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-surface-0 text-text-default">
      <NavBar />
      <Toolbar />
      <div className="flex flex-1 divide-x divide-border-default overflow-hidden">
        <div className="flex w-[460px] shrink-0 flex-col divide-y divide-border-default overflow-auto">
          <CameraPanel scans={scans} />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Card className="flex-1 overflow-hidden">
            <CardHeader title="Rough" />
            <div className="min-h-0 flex-1 overflow-auto p-3">
              <ChartsPanel onScanComplete={addScan} />
            </div>
          </Card>
        </div>

        <div className="flex w-[460px] shrink-0 flex-col divide-y divide-border-default overflow-hidden">
          <div className="shrink-0 overflow-auto">
            <ResultPanel onSpectrumComplete={addSpectrum} />
          </div>
          <PastScansPanel
            scans={scans}
            spectrums={spectrums}
            onUpdateScanNote={updateScanNote}
            onUpdateSpectrumNote={updateSpectrumNote}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
