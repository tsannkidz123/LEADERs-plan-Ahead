import React from 'react';
import { Subject, Grade, GRADES_LIST, Language } from '../types';
import { MOCK_MATERIALS, TRANSLATIONS } from '../constants';
import { FileText, ExternalLink, ChevronRight, FolderOpen, ArrowLeft, Cloud } from 'lucide-react';

interface MainContentProps {
  selectedSubject: Subject | null;
  selectedGrade: Grade | null;
  onSelectGrade: (grade: Grade) => void;
  onBackToGrades: () => void;
  language: Language;
  isDriveConnected: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  selectedSubject, 
  selectedGrade, 
  onSelectGrade,
  onBackToGrades,
  language,
  isDriveConnected
}) => {
  
  const t = TRANSLATIONS[language];

  // View 1: Initial Welcome State
  if (!selectedSubject) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <FolderOpen className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.welcomeTitle}</h2>
        <p className="text-slate-500 max-w-md">
          {t.welcomeDesc}
        </p>
      </div>
    );
  }

  const translatedSubject = t.subjectsMap[selectedSubject];

  // View 2: Material List (Deepest View)
  if (selectedGrade) {
    return (
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <button 
          onClick={onBackToGrades}
          className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> {t.backToGrades}
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            {translatedSubject} 
            <ChevronRight className="w-6 h-6 text-slate-400" /> 
            <span className="text-blue-600">{selectedGrade}</span>
          </h1>
          <p className="text-slate-500">{t.browsing}</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid gap-0 divide-y divide-slate-100">
            {MOCK_MATERIALS.map((material) => (
              <div key={material.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className={`p-3 rounded-lg transition-colors ${isDriveConnected ? 'bg-green-50 text-green-600 group-hover:bg-green-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                    {isDriveConnected ? <Cloud className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{material.title}</h3>
                    <p className="text-sm text-slate-500">{material.type} • {material.date}</p>
                  </div>
                </div>
                <button className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow ${
                  isDriveConnected 
                    ? 'border-green-200 hover:border-green-400 text-green-700 hover:text-green-800' 
                    : 'border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                }`}>
                  <ExternalLink className="w-4 h-4" />
                  {isDriveConnected ? t.openInDrive : t.easyAccess}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // View 3: Grade Selector (Intermediate View)
  return (
    <div className="flex-1 p-8 overflow-y-auto h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{translatedSubject}</h1>
        <p className="text-slate-500">{t.selectGrade}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GRADES_LIST.map((grade) => (
          <button
            key={grade}
            onClick={() => onSelectGrade(grade)}
            className="group relative flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
              <span className="text-xl font-bold text-blue-600 group-hover:text-white">{grade}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">{t.gradePrefix} {grade.replace('P', '')}</h3>
            <p className="text-sm text-slate-500 mb-4">{language === 'zh' ? '访问教案、工作表和试卷。' : 'Access lesson plans, worksheets, and exam papers.'}</p>
            <div className="mt-auto flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              {t.viewMaterials} <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};