
import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center p-6 border rounded-lg">
        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Lead Prioritization</h3>
        <p className="text-sm text-muted-foreground">
          Identify your most valuable leads with our weighted scoring model that analyzes engagement, company details, and more.
        </p>
      </div>
      
      <div className="text-center p-6 border rounded-lg">
        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Account Penetration</h3>
        <p className="text-sm text-muted-foreground">
          Visualize your penetration level within target accounts and identify opportunities for deeper engagement.
        </p>
      </div>
      
      <div className="text-center p-6 border rounded-lg">
        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Intent Detection</h3>
        <p className="text-sm text-muted-foreground">
          Detect buying signals based on website behavior, content engagement, and other key indicators.
        </p>
      </div>
    </div>
  );
};

export default FeaturesSection;
