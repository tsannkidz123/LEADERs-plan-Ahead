
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { AICopilot } from './components/AICopilot';
import { Subject, Grade, Language, DriveStats } from './types';

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [driveEmail, setDriveEmail] = useState<string>("");
  const [driveStats, setDriveStats] = useState<DriveStats>({
    used: "0GB",
    total: "0GB",
    percent: 0
  });

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedGrade(null); // Reset grade when subject changes
    setSearchQuery(''); // Clear search when navigating
  };

  const handleSelectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setSearchQuery(''); // Clear search when navigating
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setSearchQuery('');
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
        driveEmail={driveEmail}
        onSetDriveEmail={setDriveEmail}
        driveStats={driveStats}
        onSetDriveStats={setDriveStats}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
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
          searchQuery={searchQuery}
        />
      </main>

      {/* AI Co-pilot - Fixed Overlay */}
      <AICopilot language={language} />
    </div>
  );
};

export default App;
