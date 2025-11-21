
import React, { useState, useEffect } from 'react';
import { Language, SmartFileProposal } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, UploadCloud, FileText, Wand2, FolderInput, CheckCircle, ArrowRight, ExternalLink, Tag, GitMerge } from 'lucide-react';

interface SmartFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SmartFileModal: React.FC<SmartFileModalProps> = ({ isOpen, onClose, language }) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review' | 'success'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [proposal, setProposal] = useState<SmartFileProposal | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTimeout(() => {
        setStep('upload');
        setFile(null);
        setProposal(null);
      }, 300);
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      startAnalysis(e.target.files[0]);
    }
  };

  const startAnalysis = (file: File) => {
    setStep('analyzing');
    
    // Simulate AI Analysis time
    setTimeout(() => {
      const filename = file.name;
      const ext = filename.split('.').pop() || '';
      const lowerName = filename.toLowerCase();

      // --- 1. Detect Attributes (Auto Sorting Logic) ---
      
      // Grade Detection
      let grade = 'General';
      const gradeMatch = filename.match(/P[1-6]/i);
      if (gradeMatch) grade = gradeMatch[0].toUpperCase();
      else if (lowerName.includes('primary')) grade = 'Primary';

      // Subject Detection (Handle abbreviations like BC, MA)
      let subject = 'General';
      if (lowerName.includes('bc') || lowerName.includes('chinese') || lowerName.includes('华文')) subject = 'Chinese';
      else if (lowerName.includes('math') || lowerName.includes('ma') || lowerName.includes('numeracy')) subject = 'Mathematics';
      else if (lowerName.includes('sci') || lowerName.includes('sc') || lowerName.includes('physics')) subject = 'Science';
      else if (lowerName.includes('eng') || lowerName.includes('el')) subject = 'English';
      else if (lowerName.includes('malay') || lowerName.includes('ml')) subject = 'Malay';

      // Topic/Term Detection
      let topic = 'Materials';
      if (lowerName.includes('quarter 1') || lowerName.includes('q1') || lowerName.includes('term 1')) topic = 'Quarter 1';
      else if (lowerName.includes('quarter 2') || lowerName.includes('q2') || lowerName.includes('term 2')) topic = 'Quarter 2';
      else if (lowerName.includes('quarter 3') || lowerName.includes('q3') || lowerName.includes('term 3')) topic = 'Quarter 3';
      else if (lowerName.includes('quarter 4') || lowerName.includes('q4') || lowerName.includes('term 4')) topic = 'Quarter 4';
      else if (lowerName.includes('pretest') || lowerName.includes('pre-test')) topic = 'Pretest';
      else if (lowerName.includes('assessment') || lowerName.includes('exam') || lowerName.includes('ca') || lowerName.includes('test')) topic = 'Assessment';
      else if (lowerName.includes('ppt') || lowerName.includes('slides')) topic = 'Slides';
      else if (lowerName.includes('worksheet') || lowerName.includes('ws')) topic = 'Worksheets';

      // Year Detection (Simple)
      const currentYear = new Date().getFullYear().toString();
      let year = currentYear;
      const yearMatch = filename.match(/20[2-3][0-9]/);
      if (yearMatch) year = yearMatch[0];

      // --- 2. Construct Suggested Info ---

      // Naming Convention: Grade_Subject_Topic.ext
      const suggestedName = `${grade}_${subject}_${topic.replace(/\s+/g, '')}.${ext}`;
      
      // Path Construction based on Attributes
      const targetPath = `My Drive / Teaching Resources / ${subject} / ${grade} / ${topic}`;
      
      // Generate Search Link
      const targetLink = `https://drive.google.com/drive/search?q=${encodeURIComponent(suggestedName)}`;

      setProposal({
        originalName: filename,
        suggestedName: suggestedName,
        detectedSubject: subject,
        detectedGrade: grade,
        attributes: {
            grade,
            subject,
            topic,
            year
        },
        targetPath: targetPath,
        targetLink: targetLink,
        confidence: 98
      });
      setStep('review');
    }, 2500);
  };

  const handleApply = () => {
    setStep('success');
    // Simulate API call to Drive in a real app
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Wand2 className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-lg">{t.smartModal.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative group">
               <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={handleFileSelect}
              />
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-slate-600 font-medium text-center px-4">{t.smartModal.dropText}</p>
              <p className="text-xs text-slate-400 mt-2">PDF, DOCX, JPG</p>
            </div>
          )}

          {/* Step 2: Analyzing */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <Wand2 className="absolute inset-0 m-auto text-purple-500 w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">{t.smartModal.analyzing}</h4>
              <div className="max-w-xs mx-auto w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
                <div className="h-full bg-purple-500 animate-progress w-full origin-left"></div>
              </div>
              <p className="text-xs text-slate-400 mt-4 max-w-xs">Parsing attributes like 'P1', 'BC', 'Quarter 1' to determine sorting destination...</p>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && proposal && (
            <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                <FileText className="w-8 h-8 text-slate-400" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-slate-500 uppercase font-bold">{t.smartModal.original}</p>
                  <p className="text-sm font-medium text-slate-700 truncate">{proposal.originalName}</p>
                </div>
              </div>

              {/* Auto Sorting Visualization */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-0.5 rounded-full text-[10px] font-bold border border-purple-200 flex items-center gap-1">
                      <GitMerge className="w-3 h-3" /> {t.smartModal.sortingCriteria}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold flex items-center gap-1"><Tag className="w-3 h-3" /> {proposal.attributes.grade}</span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold flex items-center gap-1"><Tag className="w-3 h-3" /> {proposal.attributes.subject}</span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold flex items-center gap-1"><Tag className="w-3 h-3" /> {proposal.attributes.topic}</span>
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs font-medium">{proposal.attributes.year}</span>
                  </div>
                  <div className="mt-3 text-center">
                      <ArrowRight className="w-4 h-4 text-purple-300 mx-auto rotate-90 mb-1" />
                  </div>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-purple-600 uppercase mb-1 flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> {t.smartModal.suggestedName}
                    </label>
                    <input 
                        type="text" 
                        value={proposal.suggestedName}
                        onChange={(e) => setProposal({...proposal, suggestedName: e.target.value})}
                        className="w-full p-3 border border-purple-200 bg-purple-50/50 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <FolderInput className="w-3 h-3" /> {t.smartModal.targetPath}
                    </label>
                    <div className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center gap-2">
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600">DRIVE</span>
                        <span className="truncate">{proposal.targetPath}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        {t.smartModal.confidence} <span className="text-green-600 font-bold">{proposal.confidence}%</span>
                    </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success / Locate */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{t.smartModal.success}</h4>
              <p className="text-slate-500 text-sm max-w-xs mb-6 text-center">
                  {t.smartModal.successDetail}
                  <br/>
                  {language === 'zh' ? '请在云端硬盘中定位文件以进行最终确认。' : 'Please locate the file in Drive to double confirm.'}
              </p>
              
              {proposal?.targetLink && (
                  <a 
                    href={proposal.targetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t.smartModal.locate}
                  </a>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            {step === 'review' ? (
                <>
                    <button 
                        onClick={() => setStep('upload')}
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800"
                    >
                        {t.cancel}
                    </button>
                    <button 
                        onClick={handleApply}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-purple-200 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {t.smartModal.apply}
                    </button>
                </>
            ) : step === 'success' ? (
                 <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg"
                >
                    Close Window
                </button>
            ) : (
                <button 
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                    {t.cancel}
                </button>
            )}
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
    