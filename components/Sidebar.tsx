
import React, { useState, useRef } from 'react';
import { Subject, SUBJECTS_LIST, Language, DriveStats } from '../types';
import { TRANSLATIONS } from '../constants';
import { SmartFileModal } from './SmartFileModal';
import { BookOpen, GraduationCap, Languages, Calculator, FlaskConical, Search, Plus, Wand2, FileCog, Globe, Cloud, Loader2, LogOut, X, Settings2, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDriveConnected: boolean;
  onToggleDrive: () => void;
  driveEmail: string;
  onSetDriveEmail: (email: string) => void;
  driveStats: DriveStats;
  onSetDriveStats: (stats: DriveStats) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

// Declare global google and gapi types to avoid TS errors without full type defs
declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedSubject, 
  onSelectSubject, 
  language, 
  setLanguage, 
  isDriveConnected, 
  onToggleDrive,
  driveEmail,
  onSetDriveEmail,
  driveStats,
  onSetDriveStats,
  searchQuery,
  onSearch
}) => {
  
  const t = TRANSLATIONS[language];
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showSmartFileModal, setShowSmartFileModal] = useState(false); // New state for Smart Modal
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Real Integration State
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDriveClick = () => {
    if (!isDriveConnected) {
      setShowDriveModal(true);
    } else {
      onToggleDrive();
    }
  };

  const handleRealConnect = async () => {
    if (!clientId || !apiKey) {
      setErrorMsg("Please enter both Client ID and API Key");
      return;
    }
    setErrorMsg('');
    setIsSyncing(true);

    try {
      if (!window.gapi || !window.google) {
        throw new Error("Google scripts not loaded.");
      }

      // 1. Load GAPI client
      await new Promise<void>((resolve) => window.gapi.load('client', resolve));
      
      // 2. Init GAPI with API Key (for discovery)
      await window.gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      });

      // 3. Init Token Client (GIS)
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              // 4. Fetch Drive Data
              const response = await window.gapi.client.drive.about.get({
                fields: 'user, storageQuota'
              });
              
              const { user, storageQuota } = response.result;
              
              // Format stats
              const usedGb = (parseInt(storageQuota.usage) / (1024*1024*1024)).toFixed(1);
              const totalGb = (parseInt(storageQuota.limit) / (1024*1024*1024)).toFixed(0);
              const percent = Math.min(100, Math.round((parseInt(storageQuota.usage) / parseInt(storageQuota.limit)) * 100));

              onSetDriveStats({
                used: `${usedGb}GB`,
                total: `${totalGb}GB`,
                percent: percent,
                userDisplayName: user.displayName
              });
              
              onSetDriveEmail(user.emailAddress);
              setShowDriveModal(false);
              onToggleDrive();
            } catch (apiErr) {
              console.error(apiErr);
              setErrorMsg("Failed to fetch Drive data. Check scopes.");
            }
          }
          setIsSyncing(false);
        },
        error_callback: (err: any) => {
             console.error(err);
             setErrorMsg("Authentication failed.");
             setIsSyncing(false);
        }
      });

      // 4. Request Access
      tokenClient.requestAccessToken({prompt: 'consent'});

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Connection failed");
      setIsSyncing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadStatus(t.uploading);
      
      // Simulate upload delay
      setTimeout(() => {
        setUploadStatus(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Enhanced feedback: Prompt to view in Drive if connected
        if (isDriveConnected) {
          // Ask user if they want to view the file
          const shouldView = window.confirm(
            `${t.prompts.uploadComplete}: ${file.name}\n\n${t.prompts.viewInDrive}`
          );
          
          if (shouldView) {
            // Open Google Drive Search for the specific filename
            window.open(`https://drive.google.com/drive/search?q=${encodeURIComponent(file.name)}`, '_blank');
          }
        } else {
          // Fallback for not connected state
          alert(`${t.fileSelected} ${file.name} - ${t.uploadSuccess}`);
        }
      }, 1500);
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
    <div className="w-full md:w-64 bg-white border-r border-slate-200 h-full min-h-screen flex flex-col shadow-sm z-10 relative">
      {/* File Input (Hidden) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />

      {/* Smart File Modal */}
      <SmartFileModal 
        isOpen={showSmartFileModal} 
        onClose={() => setShowSmartFileModal(false)} 
        language={language}
      />

      {/* Drive Selection Modal */}
      {showDriveModal && (
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full rounded-xl shadow-2xl p-1 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
             <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-slate-500" />
                    {t.linkDrive}
                </h3>
                <button onClick={() => setShowDriveModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                </button>
             </div>

            <div className="p-4">
                <div className="space-y-3">
                    <div className="space-y-2">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t.clientId}</label>
                        <input 
                            type="text" 
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full text-xs p-2 border rounded bg-slate-50 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="7392...apps.googleusercontent.com"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t.apiKey}</label>
                        <input 
                            type="password" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full text-xs p-2 border rounded bg-slate-50 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="AIza..."
                        />
                    </div>
                    </div>
                    
                    {errorMsg && <p className="text-red-500 text-xs font-medium">{errorMsg}</p>}
                    
                    <p className="text-[10px] text-slate-400 italic">
                    * {t.configHelp}
                    </p>

                    <button 
                    onClick={handleRealConnect}
                    disabled={isSyncing}
                    className="w-full mt-2 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                    {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {t.connectReal}
                    </button>
                </div>
                
                <button 
                onClick={() => setShowDriveModal(false)}
                className="w-full mt-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 border-t border-slate-100"
                >
                {t.cancel}
                </button>
            </div>
          </div>
        </div>
      )}

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
          onClick={handleUploadClick}
          disabled={uploadStatus !== null}
          className={`w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${
            isDriveConnected 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {uploadStatus ? (
            <>
               <Loader2 className="w-4 h-4 animate-spin" />
               <span>{t.uploading}</span>
            </>
          ) : (
            <>
              {isDriveConnected ? <Cloud className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isDriveConnected ? t.uploadDrive : t.quickUpload}</span>
            </>
          )}
        </button>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="text-xs font-bold text-purple-800 mb-2 uppercase tracking-wide flex items-center gap-1">
                <Wand2 className="w-3 h-3" /> {t.smartTools}
            </h3>
            <button 
                onClick={() => setShowSmartFileModal(true)}
                className="w-full flex items-center gap-2 text-xs font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 p-2 rounded transition-colors text-left"
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
                <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${driveStats.percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-slate-500">
                  <p className="font-medium text-slate-700 truncate w-32">{driveStats.userDisplayName || driveEmail}</p>
                  <p>{driveStats.used} / {driveStats.total}</p>
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
