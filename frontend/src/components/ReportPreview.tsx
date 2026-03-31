import { WeekData } from "@/types/report";
import { SECTIONS } from "@/data/sections";

interface ReportPreviewProps {
  activeWeek: WeekData | null;
}

export function ReportPreview({ activeWeek }: ReportPreviewProps) {
  if (!activeWeek) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a week to preview report.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-xl font-bold">BVRIT HYDERABAD College of Engineering for Women</h1>
        <p className="text-xs text-muted-foreground mt-1">(UGC Autonomous Institution | Approved by AICTE | Affiliated to JNTUH)</p>
        <h2 className="text-lg font-bold mt-4">Weekly Report</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Week Duration: {activeWeek.weekInfo.label}
        </p>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => {
        const sectionData = activeWeek.sections[section.id];
        const entries = sectionData?.entries || [];

        return (
          <div key={section.id} className="mb-8">
            <h3 className="font-bold text-sm mb-3 border-b pb-1">
              {section.number}. {section.title}
              {section.subtitle && <span className="font-normal text-muted-foreground"> ({section.subtitle})</span>}
            </h3>

            {entries.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No entries</p>
            ) : section.isTextOnly ? (
              <div className="space-y-2">
                {entries.map((entry: any, idx: number) => (
                  <p key={idx} className="text-sm">{entry.details}</p>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">S.No</th>
                      {section.fields.map((f) => (
                        <th key={f.key} className="p-2 text-left font-medium">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry: any, idx: number) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{idx + 1}</td>
                        {section.fields.map((f) => (
                          <td key={f.key} className="p-2">{entry[f.key] || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
