import React, { useState, useRef } from 'react';
import { Loader2, Sparkles, Upload, FileImage, X, FileText, Plus } from 'lucide-react';

interface InputFormProps {
  onGenerate: (level: string, period: string, week: string, subject: string, files?: { data: string, mimeType: string }[]) => void;
  isLoading: boolean;
}

interface FileData {
  id: string; // Unique ID for UI handling
  name: string;
  data: string;
  mimeType: string;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [level, setLevel] = useState('Niveau 4');
  const [period, setPeriod] = useState('Période 3');
  const [week, setWeek] = useState('Semaine 2');
  const [subject, setSubject] = useState('');
  
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
    // Reset input so same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
    
    if (validFiles.length === 0) return;

    const filePromises = validFiles.map(file => new Promise<FileData>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64String.split(',')[1];
        resolve({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          mimeType: file.type,
          data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }));

    Promise.all(filePromises).then(newFiles => {
      setSelectedFiles(prev => [...prev, ...newFiles]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If files are uploaded, subject is optional. If no files, subject is required.
    const hasFiles = selectedFiles.length > 0;
    if (subject.trim() || hasFiles) {
      const payloadFiles = hasFiles ? selectedFiles.map(f => ({ data: f.data, mimeType: f.mimeType })) : undefined;
      onGenerate(level, period, week, subject, payloadFiles);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-yellow-500">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 font-serif">Créer une Leçon</h2>
        <p className="text-gray-500 mt-2">Texte, Images ou Documents</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Context Selects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Niveau Scolaire</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
          >
            <option value="Niveau 1">Niveau 1 (1AEP)</option>
            <option value="Niveau 2">Niveau 2 (2AEP)</option>
            <option value="Niveau 3">Niveau 3 (3AEP)</option>
            <option value="Niveau 4">Niveau 4 (4AEP)</option>
            <option value="Niveau 5">Niveau 5 (5AEP)</option>
            <option value="Niveau 6">Niveau 6 (6AEP)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              {[1, 2, 3, 4].map(p => (
                <option key={p} value={`Période ${p}`}>Période {p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semaine</label>
            <select 
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
               {[1, 2, 3, 4, 5].map(w => (
                <option key={w} value={`Semaine ${w}`}>Semaine {w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* File Upload Zone */}
        <div className="space-y-3">
            <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer border-gray-300 hover:border-blue-500 hover:bg-blue-50`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                />
                
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">
                        Ajouter Images ou PDFs
                    </p>
                    <p className="text-xs text-gray-400">
                        (Supporte plusieurs fichiers)
                    </p>
                </div>
            </div>

            {/* File List */}
            {selectedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 border border-gray-200">
                    {selectedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 overflow-hidden">
                                {file.mimeType === 'application/pdf' ? (
                                    <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                                ) : (
                                    <FileImage className="w-5 h-5 text-green-600 flex-shrink-0" />
                                )}
                                <span className="text-xs text-gray-700 truncate max-w-[180px]" title={file.name}>
                                    {file.name}
                                </span>
                            </div>
                            <button 
                                type="button"
                                onClick={() => removeFile(file.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <div className="text-xs text-center text-gray-400 pt-1">
                        {selectedFiles.length} fichier(s) ajouté(s)
                    </div>
                </div>
            )}
        </div>

        {/* Subject Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sujet de la leçon {selectedFiles.length > 0 ? '(Optionnel)' : '(Requis)'}
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={selectedFiles.length > 0 ? "Ex: Contextualiser les documents..." : "Ex: La forêt, Les métiers..."}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            required={selectedFiles.length === 0}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-700 to-teal-700 hover:from-blue-800 hover:to-teal-800 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Analyse & Génération...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Générer la Carte
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;