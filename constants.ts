
import { Material, Language } from './types';

// Simulated Materials Data
export const MOCK_MATERIALS: Material[] = [
  { id: '1', title: 'Quarter 1', type: 'Folder', date: '2024-01-15', link: 'https://drive.google.com/drive/u/0/my-drive' },
  { id: '2', title: 'Quarter 2', type: 'Folder', date: '2024-04-01', link: 'https://drive.google.com/drive/u/0/my-drive' },
  { id: '3', title: 'Quarter 3', type: 'Folder', date: '2024-07-01', link: 'https://drive.google.com/drive/u/0/my-drive' },
  { id: '4', title: 'Pretest', type: 'PDF', date: '2024-01-10', link: 'https://drive.google.com/drive/u/0/my-drive' },
  { id: '5', title: 'Assessment', type: 'PDF', date: '2024-05-20', link: 'https://drive.google.com/drive/u/0/my-drive' },
  { id: '6', title: 'PPT', type: 'Presentation', date: '2024-02-15', link: 'https://drive.google.com/drive/u/0/my-drive' },
];

// AI Simulation Responses Map
export const AI_RESPONSES: Record<string, string> = {
  "Show me P5 Science Q3 materials": "Access granted. Retrieving P5 Science Q3 materials now.\nOpen Folder: https://drive.google.com/drive/u/0/folders/P5-Science-Q3",
  "Convert Lesson 1.docx to PDF": "File conversion initiated. 'Lesson 1.pdf' has been successfully created and filed.",
  "Generate PPT outline for Fractions": "Lesson Plan Outline Generated (5 Slides):\n1. Title Slide\n2. What is a Fraction?\n3. Adding Fractions\n4. Practice Problems\n5. Review & Homework.",
  "Auto file new tests": "Processing file names... Files categorized and ready for virtual filing into: Malay/P3/Q1 and Science/P6/Past Papers.",
  "What needs updating?": "System Audit Summary:\nHigh Priority: P2 Chinese Q2 materials are 3 years old.\nP5 English Past Papers folder is currently empty.",
  "Rename and auto file": "I have opened the Smart Filing Assistant for you. Please upload the files you wish to process there.",
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
    easyAccess: "Folder Link",
    openInDrive: "Open Drive Folder",
    aiTitle: "Teaching AI Co-pilot",
    aiOnline: "Online",
    aiPlaceholder: "Ask AI Co-pilot...",
    aiSimMode: "AI Co-pilot (Simulation Mode)",
    gradePrefix: "Primary",
    cancel: "Cancel",
    fileSelected: "File selected:",
    uploading: "Uploading...",
    uploadSuccess: "simulated upload complete.",
    clientId: "Google Client ID",
    apiKey: "Google API Key",
    connectReal: "Authenticate & Link",
    configHelp: "Requires Google Cloud Project with Drive API enabled.",
    searchResults: "Search Results",
    noResults: "No materials found matching your search.",
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
    },
    smartModal: {
      title: "Smart Filing Assistant",
      dropText: "Drag & drop files here or click to browse",
      analyzing: "AI is analyzing attributes (Grade, Subject, Topic)...",
      review: "Review & Confirm",
      original: "Original File:",
      suggestedName: "Suggested Filename:",
      targetPath: "Target Folder:",
      sortingCriteria: "Auto-Sorting Attributes:",
      confidence: "AI Confidence:",
      apply: "Apply & File to Drive",
      success: "File Successfully Renamed & Moved!",
      successDetail: "The file is now available in your Google Drive.",
      locate: "Locate in Drive"
    },
    prompts: {
        uploadComplete: "Upload Complete",
        viewInDrive: "Open Google Drive to view this file?"
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
    easyAccess: "文件夹链接",
    openInDrive: "打开云端文件夹",
    aiTitle: "教学 AI 助手",
    aiOnline: "在线",
    aiPlaceholder: "向 AI 助手提问...",
    aiSimMode: "AI 助手 (模拟模式)",
    gradePrefix: "小学",
    cancel: "取消",
    fileSelected: "已选择文件：",
    uploading: "上传中...",
    uploadSuccess: "模拟上传完成。",
    clientId: "Google 客户端 ID",
    apiKey: "Google API 密钥",
    connectReal: "验证并连接",
    configHelp: "需要启用了 Drive API 的 Google Cloud 项目。",
    searchResults: "搜索结果",
    noResults: "未找到符合搜索条件的材料。",
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
    },
    smartModal: {
      title: "智能归档助手",
      dropText: "将文件拖放到此处或点击浏览",
      analyzing: "AI 正在分析属性 (年级, 科目, 主题)...",
      review: "查看并确认",
      original: "原始文件：",
      suggestedName: "建议文件名：",
      targetPath: "目标文件夹：",
      sortingCriteria: "自动分类属性：",
      confidence: "AI 置信度：",
      apply: "应用并归档至云端",
      success: "文件已成功重命名并移动！",
      successDetail: "该文件现在可在您的 Google 云端硬盘中找到。",
      locate: "在云端硬盘中定位"
    },
    prompts: {
        uploadComplete: "上传完成",
        viewInDrive: "打开 Google 云端硬盘查看此文件？"
    }
  }
};
