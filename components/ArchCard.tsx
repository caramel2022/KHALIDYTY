import React from 'react';
import { LessonSection } from '../types';
import { Clock, MessageCircle, PenTool, BookOpen } from 'lucide-react';

interface ArchCardProps {
  section: LessonSection;
}

const ArchCard: React.FC<ArchCardProps> = ({ section }) => {
  // Determine styles based on type
  let colorTheme = {
    border: 'border-blue-700',
    bgHeader: 'bg-blue-700',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-700',
    iconBg: 'bg-white',
    shadow: 'shadow-blue-200'
  };

  let Icon = MessageCircle;

  if (section.type === 'writing') {
    colorTheme = {
      border: 'border-teal-700',
      bgHeader: 'bg-teal-700',
      bgLight: 'bg-teal-50',
      iconColor: 'text-teal-700',
      iconBg: 'bg-white',
      shadow: 'shadow-teal-200'
    };
    Icon = PenTool;
  } else if (section.type === 'reading') {
    colorTheme = {
      border: 'border-purple-700',
      bgHeader: 'bg-purple-700',
      bgLight: 'bg-purple-50',
      iconColor: 'text-purple-700',
      iconBg: 'bg-white',
      shadow: 'shadow-purple-200'
    };
    Icon = BookOpen;
  }

  return (
    <div className={`relative flex flex-col w-full h-full`}>
      {/* Decorative Timer Float */}
      <div className="absolute -top-3 -right-3 z-20 flex flex-col items-center justify-center w-12 h-12 bg-white border-2 border-orange-400 rounded-full shadow-md">
        <Clock className="w-4 h-4 text-orange-500 mb-0.5" />
        <span className="text-[10px] font-bold text-gray-700 leading-none">{section.duration}</span>
      </div>

      {/* The Arch Shape Container */}
      <div className={`relative flex-1 flex flex-col rounded-t-[3rem] rounded-b-xl border-t-4 border-x-2 border-b-4 ${colorTheme.border} bg-white shadow-sm`}>
        
        {/* Header inside Arch */}
        <div className={`${colorTheme.bgHeader} pt-8 pb-3 px-3 text-center text-white relative shrink-0`}>
            {/* Inner dashed line for decoration */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[85%] h-[85%] border border-white/30 rounded-t-[2.5rem] pointer-events-none"></div>

            <div className="flex justify-center mb-1">
                <div className={`p-1.5 rounded-full ${colorTheme.iconBg} shadow-sm`}>
                    <Icon className={`w-5 h-5 ${colorTheme.iconColor}`} />
                </div>
            </div>
            {/* Removed line-clamp-2 to show full title */}
            <h3 className="text-lg font-bold font-serif leading-tight">
                {section.title}
            </h3>
            {/* Removed truncate to show full subtitle */}
            {section.subtitle && (
                <p className="text-xs font-medium opacity-90 mt-1">{section.subtitle}</p>
            )}
        </div>

        {/* Content Body - Removed overflow-hidden to allow all items to be seen */}
        <div className="p-4 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
           <ul className="space-y-2">
            {section.content.map((item, idx) => (
                <li key={idx} className="flex items-start text-left rtl:text-right" dir="auto">
                    <span className={`inline-block w-1.5 h-1.5 mt-1.5 mr-2 rounded-full flex-shrink-0 ${colorTheme.bgHeader}`}></span>
                    <span className="text-gray-800 text-sm font-medium leading-relaxed">{item}</span>
                </li>
            ))}
           </ul>
        </div>
        
        {/* Bottom Decorative Gold Bar */}
        <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 shrink-0"></div>
      </div>
    </div>
  );
};

export default ArchCard;