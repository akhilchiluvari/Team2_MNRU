import React, { useState } from "react";
import { SectionConfig, EntryBase, SectionData } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Edit2, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SectionFormProps {
  config: SectionConfig;
  data: SectionData;
  onAdd: (entry: Record<string, any>, contributor: string, file?: string, fileName?: string) => void;
  onUpdate: (entryId: string, updates: Record<string, any>) => void;
  onDelete: (entryId: string) => void;
  weekLabel?: string;
  canEdit?: (entry?: any) => boolean;
  canDelete?: (entry?: any) => boolean;
  role?: string;
}

export function SectionForm({ config, data, onAdd, onUpdate, onDelete, weekLabel, canEdit, canDelete, role }: SectionFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [contributor, setContributor] = useState("");
  const [file, setFile] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();

  const resetForm = () => {
    setFormData({});
    setContributor("");
    setFile(undefined);
    setFileName(undefined);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setFile(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = () => {
    if (!contributor.trim()) {
      toast.error("Contributor name is required");
      return;
    }
    const missing = config.fields.filter((f) => f.required && !formData[f.key]?.toString().trim());
    if (missing.length > 0) {
      toast.error(`Please fill: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }

    if (editingId) {
      onUpdate(editingId, { ...formData, contributorName: contributor, file, fileName });
      toast.success("Entry updated");
    } else {
      onAdd(formData, contributor, file, fileName);
      toast.success("Entry added");
    }
    resetForm();
  };

  const startEdit = (entry: EntryBase) => {
    setEditingId(entry.id);
    setIsAdding(true);
    setContributor(entry.contributorName);
    setFile(entry.file);
    setFileName(entry.fileName);
    const data: Record<string, any> = {};
    config.fields.forEach((f) => { data[f.key] = (entry as any)[f.key] || ""; });
    setFormData(data);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          {config.number}. {config.title}
        </h2>
        {config.subtitle && <p className="text-sm text-muted-foreground mt-0.5">{config.subtitle}</p>}
        {weekLabel && <p className="text-xs text-muted-foreground mt-1">Week: {weekLabel}</p>}
      </div>

      {/* Existing entries table */}
      {data.entries.length > 0 && (
        <div className="mb-6 border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">S.No</th>
                  {config.fields.map((f) => (
                    <th key={f.key} className="text-left p-3 font-medium text-muted-foreground text-xs">{f.label}</th>
                  ))}
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Contributor</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry: any, idx) => (
                  <tr key={entry.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground">{idx + 1}</td>
                    {config.fields.map((f) => (
                      <td key={f.key} className="p-3 max-w-[200px] truncate">{entry[f.key] || "—"}</td>
                    ))}
                    <td className="p-3 text-muted-foreground">{entry.contributorName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {(!canEdit || canEdit(entry)) && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(entry)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {(!canDelete || canDelete(entry)) && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { onDelete(entry.id); toast.success("Entry deleted"); }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.entries.length === 0 && !isAdding && (
        <div className="border border-dashed rounded-xl p-8 text-center mb-6">
          <p className="text-muted-foreground text-sm">No entries yet. Add your first entry below.</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding ? (
        <div className="border rounded-xl p-5 bg-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">{editingId ? "Edit Entry" : "New Entry"}</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetForm}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.fields.map((field) => (
              <div key={field.key} className={cn(field.type === "textarea" && "md:col-span-2")}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder || field.label}
                    rows={3}
                  />
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder || field.label}
                  />
                )}
              </div>
            ))}

            {/* Contributor */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Contributor Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Proof Document (optional)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors text-sm flex-1">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{fileName || "Choose file..."}</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                </label>
                {fileName && (
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setFile(undefined); setFileName(undefined); }}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-1.5" />
              {editingId ? "Update" : "Save Entry"}
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Entry
        </Button>
      )}
    </div>
  );
}
