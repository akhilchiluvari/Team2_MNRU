import { useState } from "react";
import { WeekData } from "@/types/report";
import { SECTIONS } from "@/data/sections";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DownloadReportProps {
  activeWeek: WeekData | null;
}

export function DownloadReport({ activeWeek }: DownloadReportProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(SECTIONS.map((s) => s.id)));

  if (!activeWeek) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a week to download report.
      </div>
    );
  }

  const toggleSection = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(SECTIONS.map((s) => s.id)));
  const selectNone = () => setSelected(new Set());

  const generatePDF = () => {
    if (selected.size === 0) {
      toast.error("Select at least one section");
      return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("BVRIT HYDERABAD College of Engineering for Women", pageWidth / 2, y, { align: "center" });
    y += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("(UGC Autonomous Institution | Approved by AICTE | Affiliated to JNTUH)", pageWidth / 2, y, { align: "center" });
    y += 8;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Weekly Report", pageWidth / 2, y, { align: "center" });
    y += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Week Duration: ${activeWeek.weekInfo.label}`, pageWidth / 2, y, { align: "center" });
    y += 10;

    // Sections
    const selectedSections = SECTIONS.filter((s) => selected.has(s.id));

    selectedSections.forEach((section) => {
      const entries = activeWeek.sections[section.id]?.entries || [];

      if (y > 260) { doc.addPage(); y = 15; }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const title = `${section.number}. ${section.title}${section.subtitle ? ` (${section.subtitle})` : ""}`;
      doc.text(title, 14, y);
      y += 6;

      if (entries.length === 0) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text("No entries", 14, y);
        y += 8;
      } else if (section.isTextOnly) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        entries.forEach((entry: any) => {
          const lines = doc.splitTextToSize(entry.details || "", pageWidth - 28);
          if (y + lines.length * 4 > 280) { doc.addPage(); y = 15; }
          doc.text(lines, 14, y);
          y += lines.length * 4 + 4;
        });
      } else {
        const headers = ["S.No", ...section.fields.map((f) => f.label)];
        const rows = entries.map((entry: any, idx: number) => [
          (idx + 1).toString(),
          ...section.fields.map((f) => (entry[f.key] || "—").toString()),
        ]);

        autoTable(doc, {
          startY: y,
          head: [headers],
          body: rows,
          margin: { left: 14, right: 14 },
          styles: { fontSize: 7.5, cellPadding: 2 },
          headStyles: { fillColor: [30, 70, 90], fontStyle: "bold", fontSize: 7.5 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          theme: "grid",
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      }
    });

    doc.save(`Weekly_Report_${activeWeek.weekInfo.label.replace(/\s+/g, "_")}.pdf`);
    toast.success("PDF downloaded!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Download Report</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Week: {activeWeek.weekInfo.label}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
        <Button variant="outline" size="sm" onClick={selectNone}>Deselect All</Button>
      </div>

      {/* Section selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        {SECTIONS.map((s) => {
          const entryCount = activeWeek.sections[s.id]?.entries?.length || 0;
          return (
            <label
              key={s.id}
              className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <Checkbox
                checked={selected.has(s.id)}
                onCheckedChange={() => toggleSection(s.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.number}. {s.title}</p>
                <p className="text-[11px] text-muted-foreground">{entryCount} entries</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Download buttons */}
      <div className="flex gap-3">
        <Button onClick={generatePDF} className="gap-2" size="lg">
          <Download className="w-4 h-4" />
          Download PDF ({selected.size} sections)
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => {
            selectAll();
            setTimeout(generatePDF, 100);
          }}
        >
          <FileText className="w-4 h-4" />
          Full Report
        </Button>
      </div>
    </div>
  );
}
