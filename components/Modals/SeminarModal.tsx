'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X, Trash2, Save } from 'lucide-react';
import { Seminar, SeminarFormData, SeminarType, SEMINAR_TYPES, Member } from '@/lib/types';

interface Props {
  open: boolean;
  seminar: Seminar | null;
  defaultDate: string;
  members: Member[];
  error: string | null;
  onClose: () => void;
  onSave: (data: SeminarFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EMPTY_FORM: SeminarFormData = {
  date: '',
  type: 'rinudoku',
  title: '',
  assignee_a: '',
  assignee_b: '',
  assignee_c: '',
  notes: '',
};

export default function SeminarModal({
  open,
  seminar,
  defaultDate,
  members,
  error,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [form, setForm] = useState<SeminarFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmDelete(false);
      if (seminar) {
        setForm({
          date: seminar.date,
          type: seminar.type,
          title: seminar.title,
          assignee_a: seminar.assignee_a,
          assignee_b: seminar.assignee_b,
          assignee_c: seminar.assignee_c,
          notes: seminar.notes,
        });
      } else {
        setForm({ ...EMPTY_FORM, date: defaultDate });
      }
    }
  }, [open, seminar, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!seminar) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(seminar.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const set = <K extends keyof SeminarFormData>(key: K, value: SeminarFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const memberOptions = members.map((m) => m.name);

  if (!open) return null;

  const displayDate = form.date
    ? format(new Date(form.date + 'T00:00:00'), 'yyyy年M月d日（E）', { locale: ja })
    : '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 modal-backdrop z-40 animate-fade-in-up"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-fade-in-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {seminar ? '予定を編集' : '予定を追加'}
            </h2>
            {displayDate && (
              <p className="text-xs text-gray-500 mt-0.5">{displayDate}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                日付 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                ゼミ種別 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(SEMINAR_TYPES) as SeminarType[]).map((t) => {
                  const cfg = SEMINAR_TYPES[t];
                  const selected = form.type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('type', t)}
                      className={`
                        relative py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-150
                        ${selected
                          ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} shadow-sm scale-105`
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <span className={`block w-2 h-2 rounded-full ${cfg.dotClass} mx-auto mb-1`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                タイトル（任意）
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="例: 第3章まとめ"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 transition-shadow"
              />
            </div>

            {/* Assignees */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                担当者
              </label>
              <div className="space-y-2.5">
                {(['a', 'b', 'c'] as const).map((role) => {
                  const key = `assignee_${role}` as keyof SeminarFormData;
                  return (
                    <div key={role} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                        {role}
                      </span>
                      {memberOptions.length > 0 ? (
                        <select
                          value={form[key] as string}
                          onChange={(e) => set(key, e.target.value)}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-white"
                        >
                          <option value="">未設定</option>
                          {memberOptions.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={form[key] as string}
                          onChange={(e) => set(key, e.target.value)}
                          placeholder={`担当者 ${role.toUpperCase()}`}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 transition-shadow"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {memberOptions.length === 0 && (
                <p className="text-xs text-gray-400 mt-1.5">
                  ヘッダーの「メンバー管理」からメンバーを追加するとドロップダウンで選択できます
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                メモ（任意）
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="備考・連絡事項など"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 resize-none transition-shadow"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between shrink-0">
          {seminar ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`
                flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all
                ${confirmDelete
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'text-red-500 hover:bg-red-50'
                }
              `}
            >
              <Trash2 size={15} />
              {confirmDelete ? '本当に削除しますか？' : '削除'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              キャンセル
            </button>
          )}

          <button
            type="submit"
            form="seminar-form"
            disabled={saving || !form.date}
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Save size={15} />
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>
    </>
  );
}
