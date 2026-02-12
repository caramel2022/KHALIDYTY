import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Visualizer from './components/Visualizer';
import { generateLessonPlan } from './services/geminiService';
import { LessonPlan } from './types';
import { Printer, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (level: string, period: string, week: string, subject: string, files?: { data: string, mimeType: string }[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateLessonPlan(level, period, week, subject, files);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Une erreur s'est produite lors de la génération. Veuillez vérifier votre clé API ou réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {!data ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 islamic-pattern">
           <div className="mb-10 text-center">
             <div className="w-20 h-20 mx-auto bg-yellow-500 rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-white mb-4">
               🎨
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-blue-700 mb-2">
               Al-Muallim
             </h1>
             <p className="text-gray-600">Générateur de Fiches Pédagogiques Interactives</p>
           </div>
           
           <InputForm onGenerate={handleGenerate} isLoading={loading} />
           
           {error && (
             <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm max-w-md">
               {error}
             </div>
           )}
        </div>
      ) : (
        <div className="relative">
          {/* Action Bar */}
          <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
            <button 
              onClick={handleReset}
              className="bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handlePrint}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors border border-blue-500"
              title="Imprimer / Sauvegarder PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>

          <Visualizer data={data} />
        </div>
      )}
    </div>
  );
};

export default App;