/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import MoleculeViewer from './components/MoleculeViewer';
import { parseMoleculeFile } from './utils/moleculeParser';
import { MoleculeData } from './constants';
import { Atom, RotateCcw, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const [molecules, setMolecules] = useState<MoleculeData[]>([]);
  const [currentMoleculeIndex, setCurrentMoleculeIndex] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (content: string, name: string) => {
    try {
      const data = parseMoleculeFile(content);
      if (data.length === 0) {
        setError("No valid molecules found in the file. Please check the format.");
        return;
      }
      setMolecules(data);
      setCurrentMoleculeIndex(0);
      setFileName(name);
      setFileContent(content);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to parse file. Ensure it contains 'Element X Y Z' lines.");
    }
  };

  const handleReset = () => {
    setMolecules([]);
    setCurrentMoleculeIndex(0);
    setFileName("");
    setFileContent("");
    setError(null);
  };

  const nextMolecule = () => {
    if (currentMoleculeIndex < molecules.length - 1) {
      setCurrentMoleculeIndex(prev => prev + 1);
    }
  };

  const prevMolecule = () => {
    if (currentMoleculeIndex > 0) {
      setCurrentMoleculeIndex(prev => prev - 1);
    }
  };

  const currentMolecule = molecules[currentMoleculeIndex];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center text-white">
              <Atom className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight leading-none">MoleculeViz</h1>
              <p className="text-xs text-stone-500 font-mono uppercase tracking-wider">Scientific Tools</p>
            </div>
          </div>
          
          {molecules.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block px-3 py-1 bg-stone-100 rounded-md border border-stone-200 text-xs font-mono text-stone-600">
                {fileName}
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                New Upload
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {molecules.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
                Visualize Molecular Structures
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto text-lg">
                Drag and drop your coordinate files to instantly generate interactive 3D models.
              </p>
            </div>
            <FileUploader onFileUpload={handleFileUpload} />
            
            {/* Example Data Button for quick testing */}
            <button 
              onClick={() => handleFileUpload(`oneep00005_best mol#0
C -0.180582 1.896878 -1.530842
H -2.507235 -0.278649 0.921129
C 0.851140 -3.422376 1.587812
H -1.249000 1.232926 -0.465615
H 1.563138 -5.954727 1.558568
C 1.246568 1.909676 0.283128
H 4.238958 0.193096 2.575657
C 0.222891 2.309149 -0.057800
H 0.506662 -4.594988 0.425657
H -3.518831 0.108774 -2.807519
C -1.236951 1.624631 -2.250041
H 0.322041 -1.335282 0.824326
H -2.550122 2.199130 -2.890311
H 3.356392 -0.277433 1.926759
H 1.496748 -1.100252 0.346348
H 3.749803 -4.978165 1.709558
H 2.599633 2.011532 1.611218
H -2.248585 -0.193278 -2.464223
H -2.050922 -1.722086 1.900156
C -3.311346 0.630591 -1.844582
C -5.083644 1.539924 -2.641620
C 0.232766 3.991002 0.159898
H -4.762953 1.155102 -1.935031
H 1.863002 1.056718 0.458268
H 0.180012 3.619447 -1.325417
H -3.442533 2.246763 -1.175225
H 3.439420 -2.217027 1.622550
H 1.035576 3.620699 -0.268266
H 1.252185 -3.031295 1.321222
H 3.985768 -2.240481 2.424242
30`, "example_molecule.txt")}
              className="mt-8 text-sm text-stone-400 hover:text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors"
            >
              Load Example Data
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="h-[75vh] min-h-[600px] w-full relative">
               <MoleculeViewer data={currentMolecule} />
               
               {/* Navigation Overlay */}
               {molecules.length > 1 && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-stone-200 shadow-lg rounded-full p-2 flex items-center gap-4 z-10">
                   <button 
                     onClick={prevMolecule}
                     disabled={currentMoleculeIndex === 0}
                     className="p-2 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                   >
                     <ChevronLeft className="w-5 h-5 text-stone-700" />
                   </button>
                   <div className="text-sm font-mono font-medium text-stone-700 min-w-[100px] text-center">
                     {currentMoleculeIndex + 1} / {molecules.length}
                   </div>
                   <button 
                     onClick={nextMolecule}
                     disabled={currentMoleculeIndex === molecules.length - 1}
                     className="p-2 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                   >
                     <ChevronRight className="w-5 h-5 text-stone-700" />
                   </button>
                 </div>
               )}

               {/* Molecule Comment/Title Overlay */}
               {currentMolecule.comment && (
                 <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border border-stone-200 shadow-sm rounded-lg px-3 py-1.5 z-10">
                   <p className="text-xs font-mono text-stone-600 max-w-[200px] truncate">
                     {currentMolecule.comment}
                   </p>
                 </div>
               )}
            </div>
            
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-500" />
                  <h3 className="font-mono text-sm font-semibold text-stone-700">Source Data</h3>
                </div>
                <span className="text-xs text-stone-500 font-mono">{fileName}</span>
              </div>
              <pre className="p-4 text-xs font-mono text-stone-600 overflow-x-auto max-h-64 bg-stone-50/50">
                {fileContent}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
