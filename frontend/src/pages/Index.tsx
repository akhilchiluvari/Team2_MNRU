import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { SectionForm } from "@/components/SectionForm";
import { ReportPreview } from "@/components/ReportPreview";
import { DownloadReport } from "@/components/DownloadReport";
import { CreateWeekDialog } from "@/components/CreateWeekDialog";
import { useWeekData } from "@/hooks/useWeekData";
import { useAuth } from "@/hooks/useAuth";
import { getSectionById } from "@/data/sections";

const Index = () => {
  const { user, loading: authLoading, role } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [showCreateWeek, setShowCreateWeek] = useState(false);
  const {
    weeks,
    activeWeek,
    setActiveWeekId,
    createWeek,
    deleteWeek,
    getSectionData,
    addEntry,
    updateEntry,
    deleteEntry,
    getSectionStatus,
    getCompletionStats,
    loading: dataLoading,
  } = useWeekData();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const canCreateWeek = role === "admin" || role === "coordinator";
  const canDeleteWeek = role === "admin";
  const canEditEntry = (entry?: any) => {
    if (role === "admin" || role === "coordinator") return true;
    return entry?.createdBy === user.id;
  };
  const canDeleteEntry = (entry?: any) => {
    if (role === "admin" || role === "coordinator") return true;
    return entry?.createdBy === user.id;
  };

  const renderContent = () => {
    if (activeView === "dashboard") {
      return (
        <Dashboard
          activeWeek={activeWeek}
          getSectionStatus={getSectionStatus}
          getCompletionStats={getCompletionStats}
          onNavigateToSection={(id) => setActiveView(`section-${id}`)}
        />
      );
    }

    if (activeView === "report") {
      return <ReportPreview activeWeek={activeWeek} />;
    }

    if (activeView === "download") {
      return <DownloadReport activeWeek={activeWeek} />;
    }

    if (activeView.startsWith("section-")) {
      const sectionId = activeView.replace("section-", "");
      const config = getSectionById(sectionId);
      if (!config) return <div className="p-6 text-muted-foreground">Section not found.</div>;

      if (!activeWeek) {
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
            <div>
              <p className="text-lg font-medium mb-2">No Week Selected</p>
              <p className="text-sm">Create or select a week to start entering data.</p>
            </div>
          </div>
        );
      }

      return (
        <SectionForm
          config={config}
          data={getSectionData(sectionId)}
          onAdd={(entry, contributor, file, fileName) => addEntry(sectionId, entry, contributor, file, fileName)}
          onUpdate={(entryId, updates) => updateEntry(sectionId, entryId, updates)}
          onDelete={(entryId) => deleteEntry(sectionId, entryId)}
          weekLabel={activeWeek.weekInfo.label}
          canEdit={canEditEntry}
          canDelete={canDeleteEntry}
          role={role}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen w-full bg-background dark">
      <AppSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        activeWeek={activeWeek}
        weeks={weeks}
        onWeekChange={setActiveWeekId}
        onCreateWeek={() => setShowCreateWeek(true)}
        onDeleteWeek={deleteWeek}
        canCreateWeek={canCreateWeek}
        canDeleteWeek={canDeleteWeek}
        role={role}
      />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {renderContent()}
      </main>
      {canCreateWeek && (
        <CreateWeekDialog
          open={showCreateWeek}
          onClose={() => setShowCreateWeek(false)}
          onCreate={createWeek}
        />
      )}
    </div>
  );
};

export default Index;
