import { SECTIONS } from "@/data/sections";
import { SectionStatus } from "@/types/report";
import { WeekData } from "@/types/report";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, CircleDashed, TrendingUp } from "lucide-react";

interface DashboardProps {
  activeWeek: WeekData | null;
  getSectionStatus: (sectionId: string) => SectionStatus;
  getCompletionStats: () => { completed: number; inProgress: number; total: number };
  onNavigateToSection: (sectionId: string) => void;
}

const statusConfig: Record<SectionStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  empty: { label: "Empty", color: "text-muted-foreground", icon: CircleDashed },
  "in-progress": { label: "In Progress", color: "text-warning", icon: Clock },
  completed: { label: "Completed", color: "text-success", icon: CheckCircle2 },
};

const sectionEmoji: Record<number, string> = {
  1: "📋", 2: "👤", 3: "🏆", 4: "🎓", 5: "🏛️", 6: "📚", 7: "💡", 8: "🎭",
  9: "🏭", 10: "💻", 11: "📜", 12: "✈️", 13: "📄", 14: "🕉️", 15: "💼", 16: "🤝", 17: "🔧",
};

export function Dashboard({ activeWeek, getSectionStatus, getCompletionStats, onNavigateToSection }: DashboardProps) {
  if (!activeWeek) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <TrendingUp className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Week Selected</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Create or select a week from the sidebar to start entering data for your weekly report.
        </p>
      </div>
    );
  }

  const stats = getCompletionStats();
  const pct = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Week: <span className="text-foreground font-medium">{activeWeek.weekInfo.label}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Completed" value={stats.completed} total={stats.total} color="text-success" />
        <StatCard label="In Progress" value={stats.inProgress} total={stats.total} color="text-warning" />
        <StatCard label="Overall Progress" value={pct} suffix="%" color="text-primary" />
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Report Completion</span>
          <span>{stats.completed}/{stats.total} sections</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section) => {
          const status = getSectionStatus(section.id);
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          const sectionData = activeWeek.sections[section.id];
          const entryCount = sectionData?.entries?.length || 0;

          return (
            <button
              key={section.id}
              onClick={() => onNavigateToSection(section.id)}
              className={cn(
                "text-left p-4 rounded-xl border bg-card hover:bg-accent/30 transition-all duration-200 group",
                "hover:shadow-md hover:border-primary/30"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{sectionEmoji[section.number]}</span>
                <div className={cn("flex items-center gap-1 text-xs font-medium", cfg.color)}>
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {section.number}. {section.title}
              </h3>
              {section.subtitle && (
                <p className="text-[11px] text-muted-foreground mb-2">{section.subtitle}</p>
              )}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{entryCount} {entryCount === 1 ? "entry" : "entries"}</span>
                {sectionData?.lastUpdatedBy && (
                  <span>by {sectionData.lastUpdatedBy}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, total, suffix, color }: {
  label: string; value: number; total?: number; suffix?: string; color: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-3xl font-bold", color)}>
        {value}{suffix}
        {total !== undefined && <span className="text-base font-normal text-muted-foreground">/{total}</span>}
      </p>
    </div>
  );
}
