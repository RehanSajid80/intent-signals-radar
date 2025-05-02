
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    console.log("Settings button clicked");
    try {
      navigate("/settings", { replace: true });
      toast({
        title: "Navigating to settings",
        description: "Taking you to the settings page..."
      });
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/settings";
    }
  };

  return (
    <footer className="bg-neutral-50 py-6 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center mb-3">
          <img 
            src="https://www.zyter.com/wp-content/uploads/2023/04/ZTC_LOGO_FINAL1.png" 
            alt="Zyter Logo" 
            className="h-6" 
          />
        </div>
        <p>© 2025 Zyter Lead Priority Radar. All rights reserved.</p>
        <div className="mt-3">
          <Button 
            variant="link" 
            size="sm" 
            className="text-muted-foreground"
            onClick={handleSettingsClick}
          >
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
          {/* Add a direct link as a fallback */}
          <a href="/settings" className="ml-3 text-muted-foreground text-sm hover:underline">
            Settings Page
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
