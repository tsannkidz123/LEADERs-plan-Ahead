import { Material, Language } from './types';

// Simulated Materials Data
export const MOCK_MATERIALS: Material[] = [
  { id: '1', title: 'Quarter 1 Materials', type: 'Document', date: '2023-10-01' },
  { id: '2', title: 'Past Year Papers (2019-2022)', type: 'PDF', date: '2023-09-15' },
  { id: '3', title: 'Interactive Slides: Key Concepts', type: 'Presentation', date: '2023-10-10' },
  { id: '4', title: 'Student Performance Tracker', type: 'Spreadsheet', date: '2023-10-05' },
  { id: '5', title: 'Homework Assignment Sheets', type: 'Document', date: '2023-10-12' },
  { id: '6', title: 'Remedial Practice Set A', type: 'PDF', date: '2023-09-28' },
];

// AI Simulation Responses Map
export const AI_RESPONSES: Record<string, string> = {
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
    appTitle: "EduPortal",
    teacherAdmin: "Teacher Admin",
    quickUpload: "Quick Upload",
    uploadDrive: "Upload to Drive",
    searchPlaceholder: "Quick search files...",
    smartTools: "Smart Tools",
    renameFile: "Rename & Auto-file",
    subjects: "Subjects",
    storage: "Drive Storage",
    linkDrive: "Link Google Drive",
    driveConnected: "Google Drive Linked",
    disconnect: "Disconnect",
    syncing: "Syncing...",
    welcomeTitle: "Welcome to the Resource Portal",
    welcomeDesc: "Select a subject from the sidebar to begin accessing teaching materials, past papers, and lesson plans.",
    backToGrades: "Back to Grades",
    browsing: "Browsing available resources and materials.",
    selectGrade: "Select a grade level to view specific materials.",
    viewMaterials: "View Materials",
    easyAccess: "Easy Access",
    openInDrive: "Open in Drive",
    aiTitle: "Teaching AI Co-pilot",
    aiOnline: "Online",
    aiPlaceholder: "Ask AI Co-pilot...",
    aiSimMode: "AI Co-pilot (Simulation Mode)",
    gradePrefix: "Primary",
    subjectsMap: {
        Science: "Science",
        Mathematics: "Mathematics",
        Chinese: "Chinese",
        English: "English",
        Malay: "Malay"
    },
    aiActions: {
      rename: "Rename and auto file",
      audit: "What needs updating?",
      fileTests: "Auto file new tests"
    }
  },
  zh: {
    appTitle: "教育资源门户",
    teacherAdmin: "教师管理端",
    quickUpload: "快速上传",
    uploadDrive: "上传至云端硬盘",
    searchPlaceholder: "快速搜索文件...",
    smartTools: "智能工具",
    renameFile: "重命名并归档",
    subjects: "科目",
    storage: "云端硬盘存储",
    linkDrive: "关联 Google 云端硬盘",
    driveConnected: "已连接云端硬盘",
    disconnect: "断开连接",
    syncing: "同步中...",
    welcomeTitle: "欢迎使用资源门户",
    welcomeDesc: "请从侧边栏选择一个科目以开始访问教材、历年试卷和教案。",
    backToGrades: "返回年级列表",
    browsing: "浏览可用资源和材料。",
    selectGrade: "选择年级以查看具体材料。",
    viewMaterials: "查看材料",
    easyAccess: "快速访问",
    openInDrive: "在云端硬盘打开",
    aiTitle: "教学 AI 助手",
    aiOnline: "在线",
    aiPlaceholder: "向 AI 助手提问...",
    aiSimMode: "AI 助手 (模拟模式)",
    gradePrefix: "小学",
    subjectsMap: {
        Science: "科学",
        Mathematics: "数学",
        Chinese: "中文",
        English: "英文",
        Malay: "马来文"
    },
    aiActions: {
      rename: "重命名并归档",
      audit: "检查更新需求",
      fileTests: "自动归档新试卷"
    }
  }
};