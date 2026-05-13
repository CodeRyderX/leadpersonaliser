export default function DownloadButton({ csvB64, filename }) {
  function handleDownload() {
    const binaryStr = atob(csvB64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "personalised_leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-accent text-surface px-5 py-2.5 rounded text-sm font-medium hover:opacity-80 transition-opacity"
    >
      Download CSV
    </button>
  );
}
