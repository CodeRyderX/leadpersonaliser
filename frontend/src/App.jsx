import { useEffect, useState } from "react";
import Papa from "papaparse";
import DownloadButton from "./components/DownloadButton.jsx";
import PreviewTable from "./components/PreviewTable.jsx";
import ProgressIndicator from "./components/ProgressIndicator.jsx";
import ResultsTable from "./components/ResultsTable.jsx";
import UploadArea from "./components/UploadArea.jsx";

export default function App() {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [preview, setPreview] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [phase, setPhase] = useState("upload");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [lines, setLines] = useState([]);
  const [csvB64, setCsvB64] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  function handleUpload(uploadedFile) {
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const allRows = results.data;
        const hdrs = results.meta.fields;
        setHeaders(hdrs);
        setPreview(allRows.slice(0, 5));
        setTotalRows(allRows.length);
        setFile(uploadedFile);
        setPhase("preview");
      },
    });
  }

  async function handlePersonalise() {
    setPhase("processing");
    setLines([]);
    setCsvB64(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/personalise", {
      method: "POST",
      body: formData,
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop();

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const jsonStr = line.slice("data:".length).trim();
        try {
          const event = JSON.parse(jsonStr);
          if (event.type === "progress") {
            setProgress({ current: event.current, total: event.total });
          } else if (event.type === "result") {
            setLines((prev) => {
              const next = [...prev];
              next[event.index] = event.line;
              return next;
            });
          } else if (event.type === "complete") {
            setCsvB64(event.csv_b64);
            setPhase("done");
          }
        } catch {
          // ignore malformed events
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">ColdPersonaliser</h1>
            <p className="text-text-muted text-sm mt-1">
              Upload a CSV. Get personalised cold email openers.
            </p>
          </div>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="text-xs border border-border px-3 py-1.5 rounded hover:bg-surface-raised transition-colors text-text-secondary"
          >
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>

        {phase === "upload" && <UploadArea onUpload={handleUpload} />}

        {phase === "preview" && (
          <PreviewTable
            headers={headers}
            rows={preview}
            totalRows={totalRows}
            onConfirm={handlePersonalise}
          />
        )}

        {phase === "processing" && (
          <ProgressIndicator current={progress.current} total={progress.total} />
        )}

        {phase === "done" && (
          <div className="space-y-6">
            <ResultsTable headers={headers} preview={preview} lines={lines} />
            <DownloadButton csvB64={csvB64} filename="personalised_leads.csv" />
          </div>
        )}
      </div>
    </div>
  );
}
