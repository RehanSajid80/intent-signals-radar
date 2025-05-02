
import React from 'react';
import ConnectSection from './ConnectSection';
import DashboardPreview from './DashboardPreview';
import FeaturesSection from './FeaturesSection';

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ConnectSection />
          <DashboardPreview />
          <FeaturesSection />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
