
import { Link, useLocation } from "react-router-dom";
import { 
  Contact2, 
  BarChart3, 
  Building2, 
  Settings, 
  Users, 
  Bell,
  Menu,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHubspot } from "@/context/HubspotContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, badge, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {badge ? (
        <Badge variant="default" className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground">
          {badge}
        </Badge>
      ) : null}
    </Link>
  );
};

export const MobileSidebar = () => {
  const { isAuthenticated, notifications, disconnectFromHubspot } = useHubspot();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [open, setOpen] = useState(false);

  const handleNavClick = () => {
    setOpen(false);
  };

  if (!isAuthenticated) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-sidebar p-0 w-64">
        <SheetHeader className="p-4 border-b border-sidebar-border">
          <SheetTitle className="text-sidebar-foreground">
            Lead Priority Radar
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 p-3">
          <NavItem 
            to="/dashboard" 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Dashboard" 
            onClick={handleNavClick}
          />
          <NavItem 
            to="/contacts" 
            icon={<Contact2 className="h-5 w-5" />} 
            label="Contacts" 
            onClick={handleNavClick}
          />
          <NavItem 
            to="/accounts" 
            icon={<Building2 className="h-5 w-5" />} 
            label="Accounts" 
            onClick={handleNavClick}
          />
          <NavItem 
            to="/team" 
            icon={<Users className="h-5 w-5" />} 
            label="Team" 
            onClick={handleNavClick}
          />
          <NavItem 
            to="/notifications" 
            icon={<Bell className="h-5 w-5" />} 
            label="Notifications" 
            badge={unreadCount > 0 ? unreadCount : undefined}
            onClick={handleNavClick}
          />
          <NavItem 
            to="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            onClick={handleNavClick}
          />
        </div>
        <div className="mt-auto p-3 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
            onClick={() => {
              disconnectFromHubspot();
              setOpen(false);
            }}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Disconnect
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const DesktopSidebar = () => {
  const { isAuthenticated, notifications, disconnectFromHubspot } = useHubspot();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) return null;

  return (
    <div className="hidden md:flex bg-sidebar w-64 flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Lead Priority Radar</h1>
      </div>
      <div className="flex flex-col gap-1 p-3 flex-1">
        <NavItem to="/dashboard" icon={<BarChart3 className="h-5 w-5" />} label="Dashboard" />
        <NavItem to="/contacts" icon={<Contact2 className="h-5 w-5" />} label="Contacts" />
        <NavItem to="/accounts" icon={<Building2 className="h-5 w-5" />} label="Accounts" />
        <NavItem to="/team" icon={<Users className="h-5 w-5" />} label="Team" />
        <NavItem 
          to="/notifications" 
          icon={<Bell className="h-5 w-5" />} 
          label="Notifications" 
          badge={unreadCount > 0 ? unreadCount : undefined}
        />
        <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
      </div>
      <div className="mt-auto p-3 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
          onClick={disconnectFromHubspot}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Disconnect
        </Button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;
