
import React from 'react';
import ConnectSection from './ConnectSection';
import DashboardPreview from './DashboardPreview';
import FeaturesSection from './FeaturesSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Upload, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MainContent: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

  return (
    <main className="flex-1 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* New Intent Data Quick Access Card */}
          <Card className="mb-8 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-teal-700">Intent Signal Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Analyze buyer intent signals across accounts and topics. Identify companies showing high interest in your products.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-teal-500 hover:bg-teal-600">
                  <Link to="/intent">
                    <BarChart className="h-4 w-4 mr-2" />
                    View Intent Analysis
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/intent?tab=upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Intent Data
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* New Settings Quick Access Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-blue-700">HubSpot Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Set up your HubSpot API connection to start analyzing your marketing and sales data.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleNavigateToSettings}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure HubSpot API
                </Button>
              </div>
            </CardContent>
          </Card>
        
          <ConnectSection />
          <DashboardPreview />
          <FeaturesSection />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
