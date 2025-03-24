import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Menu as MenuType } from "@/lib/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, LogOut, Menu as MenuIcon } from "lucide-react";
import * as Icons from "lucide-react";

type LucideIcon = keyof typeof Icons;

export function Sidebar() {
  const { menus, logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const isActive = (route: string | undefined) => {
    if (!route) return false;
    return location.pathname === route;
  };

  const handleLogout = () => {
    logout();
  };

  const renderMenuIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    
    const IconComponent = Icons[iconName as LucideIcon];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const renderMenuItem = (menu: MenuType) => {
    // If menu has children, render a collapsible menu item
    if (menu.children && menu.children.length > 0) {
      const isOpen = openMenus[menu.id];
      return (
        <div key={menu.id} className="menu-item-container">
          <div
            className={cn(
              "sidebar-item cursor-pointer",
              { "sidebar-item-active": isOpen }
            )}
            onClick={() => toggleSubmenu(menu.id)}
          >
            {renderMenuIcon(menu.icon)}
            {!isCollapsed && (
              <>
                <span className="flex-1">{menu.name}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
            )}
          </div>
          
          {!isCollapsed && isOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-2">
              {menu.children.map((child) => renderMenuItem(child))}
            </div>
          )}
        </div>
      );
    }

    // If menu has an external URL, render a link that opens in a new tab
    if (menu.externalUrl) {
      return (
        <a
          key={menu.id}
          href={menu.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-item hover:bg-sidebar-accent"
        >
          {renderMenuIcon(menu.icon)}
          {!isCollapsed && <span>{menu.name}</span>}
        </a>
      );
    }

    // Otherwise, render a standard menu item with an internal route
    return (
      <Link
        key={menu.id}
        to={menu.route || "#"}
        className={cn(
          "sidebar-item hover:bg-sidebar-accent",
          { "sidebar-item-active": isActive(menu.route) }
        )}
      >
        {renderMenuIcon(menu.icon)}
        {!isCollapsed && <span>{menu.name}</span>}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-sidebar border-r border-sidebar-border menu-transition",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-2">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-sidebar-foreground animate-fade-in">
            Access Weaver
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {menus.map((menu) => renderMenuItem(menu))}
        </div>
      </ScrollArea>

      <div className="bg-sidebar border-t border-sidebar-border p-2">
        {!isCollapsed && (
          <div className="flex items-center mb-2 p-2">
            <div className="w-8 h-8 bg-sidebar-primary text-sidebar-primary-foreground rounded-full flex items-center justify-center">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-2 flex-1 truncate">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
