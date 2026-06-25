'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X, Trash2, Save } from 'lucide-react';
import { Seminar, SeminarFormData, SeminarType, SEMINAR_TYPES, Member, normalizeAssigneeB } from '@/lib/types';
import { CURRENT_ACTIVITY } from '@/lib/activity-config';

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
  custom_label: '',
  start_time: '',
  end_time: '',
  assignee_a: '',
  assignee_b: [],
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
          custom_label: seminar.custom_label ?? '',
          start_time: seminar.start_time ?? '',
          end_time: seminar.end_time ?? '',
          assignee_a: seminar.assignee_a,
          assignee_b: normalizeAssigneeB(seminar.assignee_b),
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
    if (!confirmDelete) { setConfirmDelete(true); return; }
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

  const handleAssigneeAChange = (val: string) => {
    setForm((f) => {
      const next = { ...f, assignee_a: val };
      if (val && next.assignee_c && next.assignee_b.length === 0) {
        next.assignee_b = members.map((m) => m.name).filter((n) => n !== val && n !== next.assignee_c);
      }
      return next;
    });
  };

  const handleAssigneeCChange = (val: string) => {
    setForm((f) => {
      const next = { ...f, assignee_c: val };
      if (f.assignee_a && val && f.assignee_b.length === 0) {
        next.assignee_b = members.map((m) => m.name).filter((n) => n !== f.assignee_a && n !== val);
      }
      return next;
    });
  };

  const toggleAssigneeB = (name: string) => {
    setForm((f) => ({
      ...f,
      assignee_b: f.assignee_b.includes(name)
        ? f.assignee_b.filter((n) => n !== name)
        : [...f.assignee_b, name],
    }));
  };

  const memberOptions = members.map((m) => m.name);

  if (!open) return null;

  const displayDate = form.date
    ? format(new Date(form.date + 'T00:00:00'), 'yyyy年M月d日（E）', { locale: ja })
    : '';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel — full screen on mobile, right drawer on sm+ */}
      <div
        className="fixed inset-0 sm:inset-auto sm:right-0 sm:top-0 sm:h-full sm:w-[440px] bg-white shadow-2xl z-50 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {seminar ? '予定を編集' : '予定を追加'}
            </h2>
            {displayDate && <p className="text-xs text-gray-500 mt-0.5">{displayDate}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2.5 sm:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-500 transition-colors touch-manipulation"
            aria-label="閉じる"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                時刻（任意）
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">開始</p>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => set('start_time', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">終了</p>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => set('end_time', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>

            {/* Type — 2×2 grid */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                種別 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(SEMINAR_TYPES) as SeminarType[]).map((t) => {
                  const cfg = SEMINAR_TYPES[t];
                  const selected = form.type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('type', t)}
                      className={`
                        py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-150
                        ${selected
                          ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} shadow-sm scale-[1.03]`
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

              {/* カスタムラベル（その他のとき表示） */}
              {form.type === 'other' && (
                <input
                  type="text"
                  value={form.custom_label}
                  onChange={(e) => set('custom_label', e.target.value)}
                  placeholder="イベント名を入力（例: 夏合宿）"
                  className="mt-2 w-full rounded-lg border border-orange-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-300 transition-shadow"
                />
              )}
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
                placeholder={CURRENT_ACTIVITY.titlePlaceholder ?? '例: タイトル・章番号など'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 transition-shadow"
              />
            </div>

            {/* Assignees */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                担当者
              </label>
              <div className="space-y-2.5">
                {/* A */}
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">A</span>
                  {memberOptions.length > 0 ? (
                    <select
                      value={form.assignee_a}
                      onChange={(e) => handleAssigneeAChange(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-white"
                    >
                      <option value="">未設定</option>
                      {memberOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={form.assignee_a} onChange={(e) => handleAssigneeAChange(e.target.value)} placeholder="担当者 A"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 transition-shadow" />
                  )}
                </div>

                {/* B — 複数選択チップ */}
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 mt-1">B</span>
                  {memberOptions.length > 0 ? (
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {memberOptions.map((name) => {
                          const sel = form.assignee_b.includes(name);
                          return (
                            <button key={name} type="button" onClick={() => toggleAssigneeB(name)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all touch-manipulation ${
                                sel ? 'bg-indigo-100 text-indigo-800 border-indigo-300 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                              }`}
                            >{name}</button>
                          );
                        })}
                      </div>
                      {form.assignee_b.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">選択中: {form.assignee_b.join('・')}</p>
                      )}
                    </div>
                  ) : (
                    <input type="text" value={form.assignee_b.join('、')}
                      onChange={(e) => set('assignee_b', e.target.value ? e.target.value.split('、') : [])}
                      placeholder="担当者 B（複数、読点区切り）"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 transition-shadow" />
                  )}
                </div>

                {/* C */}
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">C</span>
                  {memberOptions.length > 0 ? (
                    <select
                      value={form.assignee_c}
                      onChange={(e) => handleAssigneeCChange(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-white"
                    >
                      <option value="">未設定</option>
                      {memberOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={form.assignee_c} onChange={(e) => handleAssigneeCChange(e.target.value)} placeholder="担当者 C"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 transition-shadow" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {memberOptions.length === 0
                  ? 'ヘッダーの「メンバー管理」からメンバーを追加するとドロップダウンで選択できます'
                  : 'A・C を選択すると、B に残りのメンバーが自動で入力されます（B が空のとき）'}
              </p>
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

        {/* Footer — extra bottom padding on iPhone for home bar */}
        <div className="border-t border-gray-200 px-5 pt-4 pb-6 sm:py-4 flex items-center justify-between shrink-0">
          {seminar ? (
            <button type="button" onClick={handleDelete} disabled={deleting}
              className={`flex items-center gap-2 text-sm px-3 py-2.5 sm:py-2 rounded-lg transition-all touch-manipulation ${
                confirmDelete ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800' : 'text-red-500 hover:bg-red-50 active:bg-red-100'
              }`}
            >
              <Trash2 size={15} />
              {confirmDelete ? '本当に削除しますか？' : '削除'}
            </button>
          ) : (
            <button type="button" onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2.5 sm:py-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            >キャンセル</button>
          )}
          <button type="button" disabled={saving || !form.date} onClick={handleSubmit}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white text-sm font-semibold px-5 py-3 sm:py-2.5 rounded-xl transition-colors shadow-sm touch-manipulation"
          >
            <Save size={15} />
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>
    </>
  );
}
