export interface WeekInfo {
  id: string;
  startDate: string;
  endDate: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryBase {
  id: string;
  contributorName: string;
  file?: string; // base64 or filename
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionData {
  entries: EntryBase[];
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface WeekData {
  weekInfo: WeekInfo;
  sections: Record<string, SectionData>;
}

export type SectionStatus = 'empty' | 'in-progress' | 'completed';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'daterange';
  required?: boolean;
  placeholder?: string;
}

export interface SectionConfig {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  isTextOnly?: boolean; // for General Points
}
