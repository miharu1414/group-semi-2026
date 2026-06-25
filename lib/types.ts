export type SeminarType = 'rinudoku' | 'zentai' | 'kenkyu' | 'other';

export interface SeminarTypeConfig {
  label: string;
  shortLabel: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
  hoverClass: string;
}

export const SEMINAR_TYPES: Record<SeminarType, SeminarTypeConfig> = {
  rinudoku: {
    label: '輪読ゼミ',
    shortLabel: '輪読',
    bgClass: 'bg-indigo-100',
    textClass: 'text-indigo-800',
    borderClass: 'border-indigo-200',
    dotClass: 'bg-indigo-500',
    hoverClass: 'hover:bg-indigo-200',
  },
  zentai: {
    label: '全体ゼミ',
    shortLabel: '全体',
    bgClass: 'bg-violet-100',
    textClass: 'text-violet-800',
    borderClass: 'border-violet-200',
    dotClass: 'bg-violet-500',
    hoverClass: 'hover:bg-violet-200',
  },
  kenkyu: {
    label: '研究共有',
    shortLabel: '研究',
    bgClass: 'bg-teal-100',
    textClass: 'text-teal-800',
    borderClass: 'border-teal-200',
    dotClass: 'bg-teal-500',
    hoverClass: 'hover:bg-teal-200',
  },
  other: {
    label: 'その他',
    shortLabel: 'その他',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-200',
    dotClass: 'bg-orange-500',
    hoverClass: 'hover:bg-orange-200',
  },
};

export interface Seminar {
  id: string;
  date: string;
  type: SeminarType;
  title: string;
  custom_label: string;
  activity_id: string;
  start_time: string;
  end_time: string;
  assignee_a: string;
  assignee_b: string[];
  assignee_c: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  order_num: number;
  created_at: string;
}

export interface SeminarFormData {
  date: string;
  type: SeminarType;
  title: string;
  custom_label: string;
  activity_id: string;
  start_time: string;
  end_time: string;
  assignee_a: string;
  assignee_b: string[];
  assignee_c: string;
  notes: string;
}

export interface Notice {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface MemberFormData {
  name: string;
  role: string;
  order_num: number;
}

export function normalizeAssigneeB(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  if (typeof val === 'string' && val) return [val];
  return [];
}
