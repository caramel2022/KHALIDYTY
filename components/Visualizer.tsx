import React from 'react';
import { LessonPlan } from '../types';
import ArchCard from './ArchCard';

interface VisualizerProps {
  data: LessonPlan;
}

const Visualizer: React.FC<VisualizerProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4 md:p-8 print:p-0 print:bg-white print:h-screen print:w-screen">
      
      {/* The Slide Container - 16:9 Aspect Ratio but allows overflow if text is too long */}
      <div className="islamic-pattern relative w-full max-w-[1400px] aspect-[16/9] bg-white shadow-2xl flex flex-col border-8 border-double border-yellow-600/20 print:border-none print:shadow-none print:w-full print:h-full print:aspect-auto rounded-xl">
        
        {/* Corner Decor Top-Left */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20 pointer-events-none rounded-br-full border-b-2 border-r-2 border-yellow-500"></div>
        {/* Corner Decor Top-Right */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20 pointer-events-none rounded-bl-full border-b-2 border-l-2 border-yellow-500"></div>

        {/* --- HEADER SECTION --- */}
        <div className="w-full pt-6 pb-2 px-12 z-10">
          <div className="flex justify-between items-start">
             {/* Left Info */}
             <div className="flex flex-col items-start opacity-70 w-48">
                <h1 className="text-xs font-bold uppercase tracking-widest text-gray-500 font-serif">Royaume du Maroc</h1>
                <h2 className="text-[10px] text-gray-400">Ministère de l'Éducation Nationale</h2>
             </div>

             {/* Center Title */}
             <div className="text-center relative -top-2 flex-1">
                <div className="inline-block bg-white/90 backdrop-blur-sm px-10 py-3 rounded-b-3xl shadow-md border-t-0 border-x border-b border-yellow-500">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 font-serif leading-tight">
                        {data.level}
                    </h1>
                    <div className="flex justify-center gap-3 text-sm font-semibold text-gray-600 mt-1">
                        <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{data.period}</span>
                        <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{data.week}</span>
                        <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{data.session}</span>
                    </div>
                </div>
             </div>

             {/* Right Info Placeholder (Empty to maintain center alignment) */}
             <div className="flex flex-col items-end opacity-70 w-48">
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT (Columns) --- */}
        <div className="flex-1 w-full px-8 py-2 flex items-stretch justify-center gap-6 z-10">
            {data.sections.map((section) => (
            <div key={section.id} className="flex-1 min-w-0 flex flex-col">
                 <ArchCard section={section} />
            </div>
            ))}
        </div>

        {/* --- FOOTER / TIMELINE --- */}
        <div className="w-full pb-4 pt-2 z-20">
             <div className="w-3/4 mx-auto relative h-1 bg-gray-200 rounded-full flex items-center justify-between px-1">
                {/* Progress Line Background */}
                <div className="absolute left-0 top-0 h-full bg-yellow-400 rounded-full opacity-50 w-full"></div>
                
                {['Séance 1', 'Séance 2', 'Séance 3', 'Séance 4', 'Séance 5'].map((s, idx) => {
                    const isActive = data.session.includes(s.split(' ')[1]);
                    return (
                        <div key={idx} className="relative group">
                            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-yellow-500 border-yellow-600 scale-125' : 'bg-white border-gray-300'}`}></div>
                            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap ${isActive ? 'text-yellow-700' : 'text-gray-400'}`}>
                                {s}
                            </span>
                        </div>
                    );
                })}
             </div>
        </div>
        
      </div>
    </div>
  );
};

export default Visualizer;