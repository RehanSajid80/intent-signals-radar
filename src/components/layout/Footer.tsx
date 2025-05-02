
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Footer: React.FC = () => {
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
          <Link to="/settings">
            <Button 
              variant="link" 
              size="sm" 
              className="text-muted-foreground"
            >
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
