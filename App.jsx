import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Send, Minimize2, Sparkles, Bot, Wand2, BookOpen, GraduationCap, Languages, Calculator, FlaskConical, Search, Plus, FileCog, Globe, Cloud, Loader2, LogOut, FileText, ExternalLink, ChevronRight, FolderOpen, ArrowLeft, X } from 'lucide-react';

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
    appTitle: "EduPortal", teacherAdmin: "Teacher Admin", quickUpload: "Quick Upload", uploadDrive: "Upload to Drive", searchPlaceholder: "Quick search files...", smartTools: "Smart Tools", renameFile: "Rename & Auto-file", subjects: "Subjects", storage: "Drive Storage", linkDrive: "Link Google Drive", driveConnected: "Google Drive Linked", disconnect: "Disconnect", syncing: "Syncing...", welcomeTitle: "Welcome to the Resource Portal", welcomeDesc: "Select a subject from the sidebar to begin accessing teaching materials, past papers, and lesson plans.", backToGrades: "Back to Grades", browsing: "Browsing available resources and materials.", selectGrade: "Select a grade level to view specific materials.", viewMaterials: "View Materials", easyAccess: "Easy Access", openInDrive: "Open in Drive", aiTitle: "Teaching AI Co-pilot", aiOnline: "Online", aiPlaceholder: "Ask AI Co-pilot...", aiSimMode: "AI Co-pilot (Simulation Mode)", gradePrefix: "Primary", uploadTitle: "Upload Teaching Resources", uploadDrag: "Drag and drop files here or click to browse", uploadNote: "Tip: For Auto-filing, use AI Co-pilot!",
    subjectsMap: { Science: "Science", Mathematics: "Mathematics", Chinese: "Chinese", English: "English", Malay: "Malay" },
    aiActions: { rename: "Rename and auto file", audit: "What needs updating?", fileTests: "Auto file new tests" }
  },
  zh: {
    appTitle: "教育资源门户", teacherAdmin: "教师管理端", quickUpload: "快速上传", uploadDrive: "上传至云端硬盘", searchPlaceholder: "快速搜索文件...", smartTools: "智能工具", renameFile: "重命名并归档", subjects: "科目", storage: "云端硬盘存储", linkDrive: "关联 Google 云端硬盘", driveConnected: "已连接云端硬盘", disconnect: "断开连接", syncing: "同步中...", welcomeTitle: "欢迎使用资源门户", welcomeDesc: "请从侧边栏选择一个科目以开始访问教材、历年试卷和教案。", backToGrades: "返回年级列表", browsing: "浏览可用资源和材料。", selectGrade: "选择年级以查看具体材料。", viewMaterials: "查看材料", easyAccess: "快速访问", openInDrive: "在云端硬盘打开", aiTitle: "教学 AI 助手", aiOnline: "在线", aiPlaceholder: "向 AI 助手提问...", aiSimMode: "AI 助手 (模拟模式)", gradePrefix: "小学", uploadTitle: "上传教学资源", uploadDrag: "将文件拖放到此处，或点击浏览", uploadNote: "提示：要使用自动归档，请咨询 AI 助手！",
    subjectsMap: { Science: "科学", Mathematics: "数学", Chinese: "中文", English: "英文", Malay: "马来文" },
    aiActions: { rename: "重命名并归档", audit: "检查更新需求", fileTests: "自动归档新试卷" }
  }
};

const UploadModal = ({ isOpen, onClose, language, isDriveConnected }) => {
  const t = TRANSLATIONS[language];
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            {t.uploadTitle}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className={`p-8 border-2 ${isDriveConnected ? 'border-green-400 bg-green-50 border-dashed' : 'border-blue-400 bg-blue-50 border-dashed'} rounded-xl text-center cursor-pointer hover:shadow-lg transition-shadow`}>
            {isDriveConnected ? (
              <Cloud className="w-8 h-8 mx-auto mb-3 text-green-600" />
            ) : (
              <FileCog className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            )}
            <p className={`font-semibold ${isDriveConnected ? 'text-green-800' : 'text-blue-800'}`}>
              {t.uploadDrag}
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-slate-100 rounded-lg text-sm text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {t.uploadNote}
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 bg-slate-300 text-slate-800 font-medium rounded-lg hover:bg-slate-400 transition-colors">
            {language === 'zh' ? '完成' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

const AICopilot = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, isOpen, isTyping]);

  const processMessage = (text) => {
    let commandKey = text.trim();
    if (text === t.aiActions.rename) commandKey = "Rename and auto file";
    if (text === t.aiActions.audit) commandKey = "What needs updating?";
    if (text === t.aiActions.fileTests) commandKey =
