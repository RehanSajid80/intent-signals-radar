
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const { toast } = useToast();
  
  return (
    <header className="bg-white border-b py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="https://www.zyter.com/wp-content/uploads/2023/04/ZTC_LOGO_FINAL1.png" 
              alt="Zyter Logo" 
              className="h-10" 
            />
            <h1 className="text-2xl font-bold text-teal-500">
              Lead Priority Radar
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/settings">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  toast({
                    title: "Settings",
                    description: "Opening settings page..."
                  });
                }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <a 
                href="https://app.hubspot.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Go to HubSpot
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
