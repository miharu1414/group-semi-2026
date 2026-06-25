'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X, Plus, ChevronRight, CalendarDays } from 'lucide-react';
import { Seminar, SEMINAR_TYPES, normalizeAssigneeB } from '@/lib/types';

interface Props {
  open: boolean;
  dateStr: string;
  seminars: Seminar[];
  onClose: () => void;
  onAdd: () => void;
  onEdit: (seminar: Seminar) => void;
}

export default function DayDetailModal({
  open,
  dateStr,
  seminars,
  onClose,
  onAdd,
  onEdit,
}: Props) {
  if (!open || !dateStr) return null;

  const displayDate = format(new Date(dateStr + 'T00:00:00'), 'yyyy年M月d日（E）', { locale: ja });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 modal-backdrop z-40 animate-fade-in-up"
        onClick={onClose}
      />

      {/* Modal — centered */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={displayDate}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <CalendarDays size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{displayDate}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {seminars.length === 0
                    ? '予定なし'
                    : `${seminars.length}件の予定`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="閉じる"
            >
              <X size={18} />
            </button>
          </div>

          {/* Seminar list */}
          <div className="px-4 py-3 space-y-2 max-h-[55vh] overflow-y-auto">
            {seminars.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">この日の予定はありません</p>
                <p className="text-xs text-gray-300 mt-1">下のボタンから追加できます</p>
              </div>
            ) : (
              seminars.map((seminar) => {
                const cfg = SEMINAR_TYPES[seminar.type];
                const bNames = normalizeAssigneeB(seminar.assignee_b);
                const assignees: { role: string; name: string }[] = [
                  ...(seminar.assignee_a ? [{ role: 'A', name: seminar.assignee_a }] : []),
                  ...bNames.map((n) => ({ role: 'B', name: n })),
                  ...(seminar.assignee_c ? [{ role: 'C', name: seminar.assignee_c }] : []),
                ];

                const displayLabel = seminar.type === 'other'
                  ? (seminar.custom_label || 'その他')
                  : cfg.label;
                return (
                  <button
                    key={seminar.id}
                    onClick={() => onEdit(seminar)}
                    className={`
                      w-full text-left rounded-xl border p-3.5 transition-all
                      hover:shadow-md active:scale-[0.98]
                      ${cfg.bgClass} ${cfg.borderClass} ${cfg.hoverClass}
                    `}
                  >
                    {/* Type + title row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${cfg.dotClass} shrink-0`} />
                        <span className={`text-sm font-bold ${cfg.textClass}`}>{displayLabel}</span>
                        {seminar.title && (
                          <span className={`text-sm truncate ${cfg.textClass} opacity-75`}>
                            — {seminar.title}
                          </span>
                        )}
                      </div>
                      <ChevronRight size={14} className={`${cfg.textClass} opacity-40 shrink-0`} />
                    </div>

                    {/* Assignees */}
                    {assignees.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-4">
                        {assignees.map(({ role, name }) => (
                          <span
                            key={`${role}-${name}`}
                            className={`
                              text-xs px-2 py-0.5 rounded-full font-medium
                              bg-white/70 ${cfg.textClass}
                            `}
                          >
                            <span className="opacity-60 mr-0.5">{role}:</span>
                            {name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {seminar.notes && (
                      <p className={`mt-1.5 text-xs pl-4 line-clamp-2 ${cfg.textClass} opacity-60`}>
                        {seminar.notes}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-100">
            <button
              onClick={onAdd}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Plus size={16} />
              予定を追加
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
