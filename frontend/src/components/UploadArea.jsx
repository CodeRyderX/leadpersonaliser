import { useRef } from "react";

export default function UploadArea({ onUpload }) {
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) onUpload(file);
  }

  return (
    <div
      className="border-2 border-dashed border-border rounded-lg p-16 text-center cursor-pointer hover:bg-surface-raised transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <p className="text-text-secondary text-sm">Drop your CSV here or click to upload</p>
      <p className="text-text-muted text-xs mt-2">.csv files only</p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
