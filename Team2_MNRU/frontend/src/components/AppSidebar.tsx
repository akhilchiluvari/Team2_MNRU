import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Trash2,
  GraduationCap,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTIONS } from "@/data/sections";
import { WeekData } from "@/types/report";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  activeWeek: WeekData | null;
  weeks: WeekData[];
  onWeekChange: (weekId: string) => void;
  onCreateWeek: () => void;
  onDeleteWeek: (weekId: string) => void;
  canCreateWeek: boolean;
  canDeleteWeek: boolean;
  role: string;
}

const sectionIcons: Record<number, string> = {
  1: "📋", 2: "👤", 3: "🏆", 4: "🎓", 5: "🏛️", 6: "📚", 7: "💡", 8: "🎭",
  9: "🏭", 10: "💻", 11: "📜", 12: "✈️", 13: "📄", 14: "🕉️", 15: "💼", 16: "🤝", 17: "🔧",
};

const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  admin: "destructive",
  coordinator: "default",
  faculty: "secondary",
};

export function AppSidebar({
  activeView,
  onViewChange,
  activeWeek,
  weeks,
  onWeekChange,
  onCreateWeek,
  onDeleteWeek,
  canCreateWeek,
  canDeleteWeek,
  role,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSections, setShowSections] = useState(true);
  const { profile, signOut } = useAuth();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 relative shrink-0",
        collapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold text-sidebar-accent-foreground">AcadTrackAI</h1>
            <p className="text-[10px] text-sidebar-foreground">Weekly Report System</p>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="p-3 border-b border-sidebar-border animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3.5 h-3.5 text-sidebar-foreground shrink-0" />
            <span className="text-xs text-sidebar-accent-foreground font-medium truncate">
              {profile?.full_name || "User"}
            </span>
          </div>
          <Badge variant={roleBadgeVariant[role] || "secondary"} className="text-[10px] capitalize">
            {role === "admin" && <Shield className="w-2.5 h-2.5 mr-1" />}
            {role}
          </Badge>
        </div>
      )}

      {/* Week Selector */}
      {!collapsed && (
        <div className="p-3 border-b border-sidebar-border animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground font-semibold">Active Week</span>
            {canCreateWeek && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-sidebar-foreground hover:text-sidebar-accent-foreground" onClick={onCreateWeek}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          {weeks.length === 0 ? (
            <p className="text-xs text-sidebar-foreground italic">No weeks created</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
              {weeks.map((w) => (
                <div
                  key={w.weekInfo.id}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors group",
                    activeWeek?.weekInfo.id === w.weekInfo.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => onWeekChange(w.weekInfo.id)}
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate flex-1">{w.weekInfo.label}</span>
                  {canDeleteWeek && (
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); onDeleteWeek(w.weekInfo.id); }}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2">
        <div className="space-y-1">
          <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active={activeView === "dashboard"} collapsed={collapsed} onClick={() => onViewChange("dashboard")} />
          <SidebarItem icon={<FileText className="w-4 h-4" />} label="Report Preview" active={activeView === "report"} collapsed={collapsed} onClick={() => onViewChange("report")} />
          <SidebarItem icon={<Download className="w-4 h-4" />} label="Download Report" active={activeView === "download"} collapsed={collapsed} onClick={() => onViewChange("download")} />
        </div>

        {!collapsed && (
          <div className="mt-4 animate-fade-in">
            <button
              className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] uppercase tracking-wider text-sidebar-foreground font-semibold"
              onClick={() => setShowSections(!showSections)}
            >
              Sections
              <ChevronRight className={cn("w-3 h-3 transition-transform", showSections && "rotate-90")} />
            </button>
            {showSections && (
              <div className="space-y-0.5 mt-1">
                {SECTIONS.map((s) => (
                  <SidebarItem
                    key={s.id}
                    icon={<span className="text-sm">{sectionIcons[s.number]}</span>}
                    label={`${s.number}. ${s.title}`}
                    active={activeView === `section-${s.id}`}
                    collapsed={collapsed}
                    onClick={() => onViewChange(`section-${s.id}`)}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}

function SidebarItem({ icon, label, active, collapsed, onClick, compact }: {
  icon: React.ReactNode; label: string; active: boolean; collapsed: boolean; onClick: () => void; compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 w-full rounded-md transition-colors text-left",
        compact ? "px-3 py-1.5 text-xs" : "px-3 py-2 text-sm",
        active
          ? "bg-sidebar-accent text-sidebar-primary font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? label : undefined}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
