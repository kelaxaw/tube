import { Input } from "#/common/ui/Input";
import { useState, type ChangeEvent } from "react";

export function FileUpload({ onUpload }: { onUpload?: (file: File) => void }) {
  const [_file, setFile] = useState<File | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    onUpload?.(selected);
  };

  return (
    <Input onChange={handleFileChange} variant="file" type="file" size="file" />
  );
}
