
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Send, Minimize2, Sparkles, Bot, Wand2, BookOpen, GraduationCap, Languages, Calculator, FlaskConical, Search, Plus, FileCog, Globe, Cloud, Loader2, LogOut, FileText, ExternalLink, ChevronRight, FolderOpen, ArrowLeft } from 'lucide-react';
export enum Subject {
  Science = 'Science',
  Mathematics = 'Mathematics',
  Chinese = 'Chinese',
  English = 'English',
  Malay = 'Malay'
}

export enum Grade {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  P5 = 'P5',
  P6 = 'P6'
}

export const SUBJECTS_LIST = [
  Subject.Science,
  Subject.Mathematics,
  Subject.Chinese,
  Subject.English,
  Subject.Malay
];

export const GRADES_LIST = [
  Grade.P1,
  Grade.P2,
  Grade.P3,
  Grade.P4,
  Grade.P5,
  Grade.P6
];

export const MOCK_MATERIALS = [
  { id: '1', title: 'Quarter 1 Materials', type: 'Document', date: '2023-10-01' },
  { id: '2', title: 'Past Year Papers (2019-2022)', type: 'PDF', date: '2023-09-15' },
  { id: '3', title: 'Interactive Slides: Key Concepts', type: 'Presentation', date: '2023-10-10' },
  { id: '4', title: 'Student Performance Tracker', type: 'Spreadsheet', date: '2023-10-05' },
  { id: '5', title: 'Homework Assignment Sheets', type: 'Document', date: '2023-10-12' },
  { id: '6', title: 'Remedial Practice Set A', type: 'PDF', date: '2023-09-28' },
];

export const AI_RESPONSES = {
  "Show me P5 Science Q3 materials": "Access granted. Retrieving P5 Science Q3 materials now. [Easy Access Link]",
  "Convert Lesson 1.docx to PDF": "File conversion initiated. 'Lesson 1.pdf' has been successfully created and filed.",
  "Generate PPT outline for Fractions": "Lesson Plan Outline Generated (5 Slides):\n1. Title Slide\n2. What is a Fraction?\n3. Adding Fractions\n4. Practice Problems\n5. Review & Homework.",
  "Auto file new tests": "Processing file names... Files categorized and ready for virtual filing into: Malay/P3/Q1 and Science/P6/Past Papers.",
  "What needs updating?": "System Audit Summary:\nHigh Priority: P2 Chinese Q2 materials are 3 years old.\nP5 English Past Papers folder is currently empty.",
  "Rename and auto file": "Scanning pending uploads...\n\n✅ Detected: 'scan_2023_11_05.pdf'\n➝ Renaming to: 'P4_Science_Worksheet_Week1.pdf'\n📂 Filing to: Science > P4 > Worksheets\n\n✅ Detected: 'IMG_8821.jpg'\n➝ Renaming to: 'P6_Math_Diagram_Geometry.jpg'\n📂 Filing to: Mathematics > P6 > Resources",
};

export const DEFAULT_AI_RESPONSE = "I am your Teaching AI Co-pilot. You can ask me to locate materials, convert files, generate lesson outlines, or organize tests.";

export const TRANSLATIONS = {
  en: {
    appTitle: "EduPortal", teacherAdmin: "Teacher Admin", quickUpload: "Quick Upload", uploadDrive: "Upload to Drive", searchPlaceholder: "Quick search files...", smartTools: "Smart Tools", renameFile: "Rename & Auto-file", subjects: "Subjects", storage: "Drive Storage", linkDrive: "Link Google Drive", driveConnected: "Google Drive Linked", disconnect: "Disconnect", syncing: "Syncing...", welcomeTitle: "Welcome to the Resource Portal", welcomeDesc: "Select a subject from the sidebar to begin accessing teaching materials, past papers, and lesson plans.", backToGrades: "Back to Grades", browsing: "Browsing available resources and materials.", selectGrade: "Select a grade level to view specific materials.", viewMaterials: "View Materials", easyAccess: "Easy Access", openInDrive: "Open in Drive", aiTitle: "Teaching AI Co-pilot", aiOnline: "Online", aiPlaceholder: "Ask AI Co-pilot...", aiSimMode: "AI Co-pilot (Simulation Mode)", gradePrefix: "Primary",
    subjectsMap: { Science: "Science", Mathematics: "Mathematics", Chinese: "Chinese", English: "English", Malay: "Malay" },
    aiActions: { rename: "Rename and auto file", audit: "What needs updating?", fileTests: "Auto file new tests" }
  },
  zh: {
    appTitle: "教育资源门户", teacherAdmin: "教师管理端", quickUpload: "快速上传", uploadDrive: "上传至云端硬盘", searchPlaceholder: "快速搜索文件...", smartTools: "智能工具", renameFile: "重命名并归档", subjects: "科目", storage: "云端硬盘存储", linkDrive: "关联 Google 云端硬盘", driveConnected: "已连接云端硬盘", disconnect: "断开连接", syncing: "同步中...", welcomeTitle: "欢迎使用资源门户", welcomeDesc: "请从侧边栏选择一个科目以开始访问教材、历年试卷和教案。", backToGrades: "返回年级列表", browsing: "浏览可用资源和材料。", selectGrade: "选择年级以查看具体材料。", viewMaterials: "查看材料", easyAccess: "快速访问", openInDrive: "在云端硬盘打开", aiTitle: "教学 AI 助手", aiOnline: "在线", aiPlaceholder: "向 AI 助手提问...", aiSimMode: "AI 助手 (模拟模式)", gradePrefix: "小学",
    subjectsMap: { Science: "科学", Mathematics: "数学", Chinese: "中文", English: "英文", Malay: "马来文" },
    aiActions: { rename: "重命名并归档", audit: "检查更新需求", fileTests: "自动归档新试卷" }
  }
};
const AICopilot = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', text: language === 'zh' ? "您好！我是您的教学 AI 助手。今天需要我帮您查找资源或整理文件吗？" : "Hello! I'm your Teaching AI Co-pilot. How can I assist you with your resources today?", timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, isOpen, isTyping]);

  const processMessage = (text) => {
    let commandKey = text.trim();
    if (text === t.aiActions.rename) commandKey = "Rename and auto file";
    if (text === t.aiActions.audit) commandKey = "What needs updating?";
    if (text === t.aiActions.fileTests) commandKey = "Auto file new tests";

    const newMessage = { id: Date.now().toString(), role: 'user', text: text.trim(), timestamp: Date.now() };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = AI_RESPONSES[commandKey] || DEFAULT_AI_RESPONSE;
      const aiResponse = { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e) => { e.preventDefault(); if (!input.trim()) return; processMessage(input); };
  const handleSuggestionClick = (suggestion) => { processMessage(suggestion); };
  const suggestions = [t.aiActions.rename, t.aiActions.audit, t.aiActions.fileTests];

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 z-50 group">
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium opacity-0 group-hover:opacity-100">{language === 'zh' ? '打开 AI 助手' : 'Open AI Co-pilot'}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300" style={{ height: '550px' }}>
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="bg-blue-500 p-1.5 rounded-lg"><Bot className="w-5 h-5 text-white" /></div><div><h3 className="text-white font-semibold text-sm">{t.aiTitle}</h3><div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-xs text-slate-300">{t.aiOnline}</span></div></div></div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"><Minimize2 className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4 scroll-smooth">
        {messages.map((msg) => (<div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'}`}>{msg.text}</div></div>))}
        {isTyping && (<div className="flex justify-start"><div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"><div className="flex gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span></div></div></div>)}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-slate-200 bg-white">
        {!isTyping && messages.length < 6 && (<div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">{suggestions.map((action, idx) => (<button key={idx} onClick={() => handleSuggestionClick(action)} className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors border border-blue-100 flex items-center gap-1"><Wand2 className="w-3 h-3" />{action}</button>))}</div>)}
        <form onSubmit={handleSendMessage} className="p-4 pt-2"><div className="flex items-center gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.aiPlaceholder} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-slate-50"/><button type="submit" disabled={!input.trim() || isTyping} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"><Send className="w-4 h-4" /></button></div><div className="mt-2 text-center"><span className="text-[10px] text-slate-400">{t.aiSimMode}</span></div></form>
      </div>
    </div>
  );
};
const MainContent = ({ selectedSubject, selectedGrade, onSelectGrade, onBackToGrades, language, isDriveConnected }) => {
  const t = TRANSLATIONS[language];
  const translatedSubject = selectedSubject ? t.subjectsMap[selectedSubject] : null;

  if (!selectedSubject) {
    return (<div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50"><div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse"><FolderOpen className="w-10 h-10 text-blue-600" /></div><h2 className="text-2xl font-bold text-slate-800 mb-2">{t.welcomeTitle}</h2><p className="text-slate-500 max-w-md">{t.welcomeDesc}</p></div>);
  }

  if (selectedGrade) {
    return (
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <button onClick={onBackToGrades} className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"><ArrowLeft className="w-4 h-4 mr-1" /> {t.backToGrades}</button>
        <header className="mb-8"><h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">{translatedSubject} <ChevronRight className="w-6 h-6 text-slate-400" /><span className="text-blue-600">{selectedGrade}</span></h1><p className="text-slate-500">{t.browsing}</p></header>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid gap-0 divide-y divide-slate-100">
            {MOCK_MATERIALS.map((material) => (
              <div key={material.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4 mb-4 sm:mb-0"><div className={`p-3 rounded-lg transition-colors ${isDriveConnected ? 'bg-green-50 text-green-600 group-hover:bg-green-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>{isDriveConnected ? <Cloud className="w-6 h-6" /> : <FileText className="w-6 h-6" />}</div><div><h3 className="font-semibold text-slate-900">{material.title}</h3><p className="text-sm text-slate-500">{material.type} • {material.date}</p></div></div>
                <button className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow ${isDriveConnected ? 'border-green-200 hover:border-green-400 text-green-700 hover:text-green-800' : 'border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700'}`}>
                  <ExternalLink className="w-4 h-4" />{isDriveConnected ? t.openInDrive : t.easyAccess}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto h-screen">
      <header className="mb-8"><h1 className="text-3xl font-bold text-slate-900 mb-2">{translatedSubject}</h1><p className="text-slate-500">{t.selectGrade}</p></header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GRADES_LIST.map((grade) => (<button key={grade} onClick={() => onSelectGrade(grade)} className="group relative flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 text-left"><div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300"><span className="text-xl font-bold text-blue-600 group-hover:text-white">{grade}</span></div><h3 className="text-lg font-semibold text-slate-800 mb-1">{t.gradePrefix} {grade.replace('P', '')}</h3><p className="text-sm text-slate-500 mb-4">{language === 'zh' ? '访问教案、工作表和试卷。' : 'Access lesson plans, worksheets, and exam papers.'}</p><div className="mt-auto flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">{t.viewMaterials} <ChevronRight className="w-4 h-4 ml-1" /></div></button>))}
      </div>
    </div>
  );
};
const Sidebar = ({ selectedSubject, onSelectSubject, language, setLanguage, isDriveConnected, onToggleDrive }) => {
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

  const getIcon = (subject) => {
    switch (subject) {
      case Subject.Science: return <FlaskConical className="w-5 h-5" />;
      case Subject.Mathematics: return <Calculator className="w-5 h-5" />;
      case Subject.Chinese: case Subject.Malay: case Subject.English: return <Languages className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 h-full min-h-screen flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-blue-600 p-2 rounded-lg"><GraduationCap className="w-6 h-6 text-white" /></div><h1 className="font-bold text-slate-800 text-lg leading-tight">{t.appTitle}<br/><span className="text-xs text-blue-600 font-medium">{t.teacherAdmin}</span></h1></div></div>
      <div className="p-4 pb-2 space-y-3">
        <div className="flex justify-end mb-2"><button onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"><Globe className="w-3 h-3" />{language === 'en' ? 'English' : '中文'}</button></div>
        <button onClick={() => alert(isDriveConnected ? "Opening Google Drive Upload Picker..." : "Upload modal would open here.")} className={`w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${isDriveConnected ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          {isDriveConnected ? <Cloud className="w-4 h-4" /> : <Plus className="w-4 h-4" />}<span>{isDriveConnected ? t.uploadDrive : t.quickUpload}</span></button>
        <div className="relative group"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" /><input type="text" placeholder={t.searchPlaceholder} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"/></div>
      </div>
      <div className="px-4 py-2">
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-xs font-bold text-indigo-800 mb-2 uppercase tracking-wide flex items-center gap-1"><Wand2 className="w-3 h-3" /> {t.smartTools}</h3>
            <button onClick={() => alert("Please open the AI Co-pilot to run the Auto-file process.")} className="w-full flex items-center gap-2 text-xs font-medium text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100 p-2 rounded transition-colors text-left"><FileCog className="w-4 h-4" />{t.renameFile}</button>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">{t.subjects}</h2>
        <nav className="space-y-1">
          {SUBJECTS_LIST.map((subject) => (<button key={subject} onClick={() => onSelectSubject(subject)} className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${selectedSubject === subject ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>{getIcon(subject)}{t.subjectsMap[subject]}</button>))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className={`rounded-xl p-4 transition-all duration-300 ${isDriveConnected ? 'bg-white border border-green-100 shadow-sm' : 'bg-white border border-slate-200 border-dashed'}`}>
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Cloud className={`w-4 h-4 ${isDriveConnected ? 'text-green-600' : 'text-slate-400'}`} />{t.storage}</h3>{isDriveConnected && <span className="text-[10px] font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">Linked</span>}</div>
          {isDriveConnected ? (<>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden"><div className="bg-green-500 h-2 rounded-full w-3/4 transition-all duration-1000 ease-out"></div></div>
              <div className="flex justify-between items-end"><div className="text-xs text-slate-500"><p className="font-medium text-slate-700">teacher@school.edu</p><p>75GB / 100GB</p></div><button onClick={handleDriveClick} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><LogOut className="w-3 h-3" /> {t.disconnect}</button></div>
            </>
          ) : (
            <button onClick={handleDriveClick} disabled={isSyncing} className="w-full py-2 px-3 bg-white border border-slate-300 hover:border-blue-400 hover:text-blue-600 text-slate-600 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group">
              {isSyncing ? (<><Loader2 className="w-4 h-4 animate-spin text-blue-600" />{t.syncing}</>) : (<><Cloud className="w-4 h-4 group-hover:text-blue-500" />{t.linkDrive}</>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
const App = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isDriveConnected, setIsDriveConnected] = useState(false);

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setSelectedGrade(null); 
  };

  const handleSelectGrade = (grade) => {
    setSelectedGrade(grade);
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar selectedSubject={selectedSubject} onSelectSubject={handleSelectSubject} language={language} setLanguage={setLanguage} isDriveConnected={isDriveConnected} onToggleDrive={() => setIsDriveConnected(!isDriveConnected)} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <MainContent selectedSubject={selectedSubject} selectedGrade={selectedGrade} onSelectGrade={handleSelectGrade} onBackToGrades={handleBackToGrades} language={language} isDriveConnected={isDriveConnected} />
      </main>
      <AICopilot language={language} />
    </div>
  );
};
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
