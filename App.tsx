import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { AICopilot } from './components/AICopilot';
import { Subject, Grade, Language } from './types';

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isDriveConnected, setIsDriveConnected] = useState(false);

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedGrade(null); // Reset grade when subject changes
  };

  const handleSelectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar - Fixed Width */}
      <Sidebar 
        selectedSubject={selectedSubject} 
        onSelectSubject={handleSelectSubject}
        language={language}
        setLanguage={setLanguage}
        isDriveConnected={isDriveConnected}
        onToggleDrive={() => setIsDriveConnected(!isDriveConnected)}
      />
      
      {/* Main Content - Flexible */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <MainContent 
          selectedSubject={selectedSubject}
          selectedGrade={selectedGrade}
          onSelectGrade={handleSelectGrade}
          onBackToGrades={handleBackToGrades}
          language={language}
          isDriveConnected={isDriveConnected}
        />
      </main>

      {/* AI Co-pilot - Fixed Overlay */}
      <AICopilot language={language} />
    </div>
  );
};

export default App;