import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { cn } from '../constants';

interface FileUploaderProps {
  onFileUpload: (content: string, fileName: string) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [onFileUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onFileUpload(content, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full max-w-2xl mx-auto"
    >
      <label
        className={cn(
          "flex flex-col items-center justify-center w-full h-64",
          "border-2 border-dashed border-stone-300 rounded-2xl",
          "bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer",
          "group"
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-200">
            <Upload className="w-8 h-8 text-stone-500" />
          </div>
          <p className="mb-2 text-lg font-medium text-stone-700">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-stone-500 font-mono">
            .TXT, .XYZ, .MOL (Text formats)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".txt,.xyz,.mol" 
          onChange={handleFileInput} 
        />
      </label>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">1</div>
            <h3 className="font-semibold text-stone-800">Upload Data</h3>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">
            Upload a text file containing atomic coordinates. The app supports standard XYZ-like formats (Element X Y Z).
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">2</div>
            <h3 className="font-semibold text-stone-800">Visualize 3D</h3>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">
            Interact with the molecule in 3D space. Rotate, zoom, and inspect the chemical structure automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
