import React, { useState } from 'react';
import { Subject, SUBJECTS_LIST, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { BookOpen, GraduationCap, Languages, Calculator, FlaskConical, Search, Plus, Wand2, FileCog, Globe, Cloud, Check, Loader2, LogOut } from 'lucide-react';

interface SidebarProps {
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDriveConnected: boolean;
  onToggleDrive: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedSubject, onSelectSubject, language, setLanguage, isDriveConnected, onToggleDrive }) => {
  
  const t = TRANSLATIONS[language];
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDriveClick = () => {
    if (!isDriveConnected) {
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        onToggleDrive();
      }, 1500);
    } else {
      onToggleDrive();
    }
  };

  const getIcon = (subject: Subject) => {
    switch (subject) {
      case Subject.Science: return <FlaskConical className="w-5 h-5" />;
      case Subject.Mathematics: return <Calculator className="w-5 h-5" />;
      case Subject.Chinese: 
      case Subject.Malay:
      case Subject.English: return <Languages className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 h-full min-h-screen flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold text-slate-800 text-lg leading-tight">{t.appTitle}<br/><span className="text-xs text-blue-600 font-medium">{t.teacherAdmin}</span></h1>
        </div>
      </div>
      
      <div className="p-4 pb-2 space-y-3">
        {/* Language Toggle */}
        <div className="flex justify-end mb-2">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
          >
            <Globe className="w-3 h-3" />
            {language === 'en' ? 'English' : '中文'}
          </button>
        </div>

        <button 
          onClick={() => alert(isDriveConnected ? "Opening Google Drive Upload Picker..." : "Upload modal would open here.")}
          className={`w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${
            isDriveConnected 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isDriveConnected ? <Cloud className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isDriveConnected ? t.uploadDrive : t.quickUpload}</span>
        </button>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-xs font-bold text-indigo-800 mb-2 uppercase tracking-wide flex items-center gap-1">
                <Wand2 className="w-3 h-3" /> {t.smartTools}
            </h3>
            <button 
                onClick={() => alert("Please open the AI Co-pilot to run the Auto-file process.")}
                className="w-full flex items-center gap-2 text-xs font-medium text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100 p-2 rounded transition-colors text-left"
            >
                <FileCog className="w-4 h-4" />
                {t.renameFile}
            </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">{t.subjects}</h2>
        <nav className="space-y-1">
          {SUBJECTS_LIST.map((subject) => (
            <button
              key={subject}
              onClick={() => onSelectSubject(subject)}
              className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedSubject === subject
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {getIcon(subject)}
              {t.subjectsMap[subject]}
            </button>
          ))}
        </nav>
      </div>

      {/* Google Drive Connection Section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className={`rounded-xl p-4 transition-all duration-300 ${isDriveConnected ? 'bg-white border border-green-100 shadow-sm' : 'bg-white border border-slate-200 border-dashed'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Cloud className={`w-4 h-4 ${isDriveConnected ? 'text-green-600' : 'text-slate-400'}`} />
              {t.storage}
            </h3>
            {isDriveConnected && <span className="text-[10px] font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">Linked</span>}
          </div>
          
          {isDriveConnected ? (
            <>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-green-500 h-2 rounded-full w-3/4 transition-all duration-1000 ease-out"></div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-slate-500">
                  <p className="font-medium text-slate-700">teacher@school.edu</p>
                  <p>75GB / 100GB</p>
                </div>
                <button onClick={handleDriveClick} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                  <LogOut className="w-3 h-3" /> {t.disconnect}
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={handleDriveClick}
              disabled={isSyncing}
              className="w-full py-2 px-3 bg-white border border-slate-300 hover:border-blue-400 hover:text-blue-600 text-slate-600 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  {t.syncing}
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 group-hover:text-blue-500" />
                  {t.linkDrive}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};