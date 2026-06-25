import { normalizeAssigneeB, Seminar } from './types';

type SeminarRecord = Record<string, unknown>;

export function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeOptionalText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeSeminarRecord(id: string, data: SeminarRecord): Seminar {
  return {
    id,
    date: normalizeOptionalText(data.date),
    type: (normalizeOptionalText(data.type) || 'rinudoku') as Seminar['type'],
    title: normalizeOptionalText(data.title),
    custom_label: normalizeOptionalText(data.custom_label),
    activity_id: normalizeOptionalText(data.activity_id),
    start_time: normalizeOptionalText(data.start_time),
    end_time: normalizeOptionalText(data.end_time),
    assignee_a: normalizeOptionalText(data.assignee_a),
    assignee_b: normalizeAssigneeB(data.assignee_b),
    assignee_c: normalizeOptionalText(data.assignee_c),
    notes: normalizeOptionalText(data.notes),
    created_at: normalizeOptionalText(data.created_at),
    updated_at: normalizeOptionalText(data.updated_at),
  };
}

export function normalizeAssigneeList(value: unknown): string[] {
  return normalizeAssigneeB(value)
    .map((name) => name.trim())
    .filter(Boolean);
}
