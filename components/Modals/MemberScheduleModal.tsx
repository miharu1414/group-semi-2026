'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X, User, CalendarDays } from 'lucide-react';
import { Seminar, Member, normalizeAssigneeB } from '@/lib/types';
import { getSeminars } from '@/lib/api';
import { CURRENT_ACTIVITY, getEventConfig } from '@/lib/activity-config';

interface Props {
  open: boolean;
  members: Member[];
  onClose: () => void;
}

const RL = {
  a: `A（${CURRENT_ACTIVITY.roles.a.short}）`,
  b: `B（${CURRENT_ACTIVITY.roles.b.short}）`,
  c: `C（${CURRENT_ACTIVITY.roles.c.short}）`,
} as const;
type RoleLabel = typeof RL[keyof typeof RL];

interface Row {
  seminar: Seminar;
  role: RoleLabel;
}

const ROLE_STYLE: Record<string, string> = {
  [RL.a]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [RL.b]: 'bg-violet-100 text-violet-800 border-violet-200',
  [RL.c]: 'bg-teal-100  text-teal-800  border-teal-200',
};

function getRoleRows(seminars: Seminar[], name: string): Row[] {
  const rows: Row[] = [];
  for (const s of seminars) {
    const bNames = normalizeAssigneeB(s.assignee_b);

    if (s.assignee_a === name) rows.push({ seminar: s, role: RL.a });
    if (bNames.includes(name))  rows.push({ seminar: s, role: RL.b });
    if (s.assignee_c === name)  rows.push({ seminar: s, role: RL.c });
  }
  return rows.sort((a, b) => a.seminar.date.localeCompare(b.seminar.date));
}

const TODAY = new Date().toISOString().slice(0, 10);

export default function MemberScheduleModal({ open, members, onClose }: Props) {
  const [selected, setSelected] = useState('');
  const [allSeminars, setAllSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPast, setShowPast] = useState(false);

  // 開閉に合わせてデータ取得・state リセット
  useEffect(() => {
    if (!open) {
      setSelected('');
      setShowPast(false);
      return;
    }
    setLoading(true);
    getSeminars()
      .then(setAllSeminars)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  // open 時に最初のメンバーを自動選択
  useEffect(() => {
    if (open && members.length > 0 && !selected) {
      setSelected(members[0].name);
    }
  }, [open, members, selected]);

  if (!open) return null;

  const allRows = selected ? getRoleRows(allSeminars, selected) : [];
  const rows = showPast ? allRows : allRows.filter((r) => r.seminar.date >= TODAY);
  const pastCount = allRows.length - rows.length;

  // 役割ごとの集計（表示中の rows を対象にする）
  const counts = { A: 0, B: 0, C: 0 };
  rows.forEach((r) => {
    if (r.role === RL.a) counts.A++;
    if (r.role === RL.b) counts.B++;
    if (r.role === RL.c) counts.C++;
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div
          className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh] rounded-t-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="担当一覧"
        >
          {/* Handle bar (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <User size={18} className="text-violet-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">担当一覧</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="閉じる"
            >
              <X size={18} />
            </button>
          </div>

          {/* Member selector */}
          <div className="px-5 pt-4 pb-3 shrink-0">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              メンバーを選択
            </label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selected === m.name
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xs opacity-70">{m.role}</span>
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* 集計バッジ */}
          {selected && !loading && rows.length > 0 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2 shrink-0">
              {(
                [
                  { label: RL.a, count: counts.A, cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                  { label: RL.b, count: counts.B, cls: 'bg-violet-50 text-violet-700 border-violet-200' },
                  { label: RL.c, count: counts.C, cls: 'bg-teal-50  text-teal-700  border-teal-200' },
                ] as const
              ).map(({ label, count, cls }) =>
                count > 0 ? (
                  <span key={label} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cls}`}>
                    {label} × {count}回
                  </span>
                ) : null
              )}
            </div>
          )}

          {/* Past toggle */}
          {selected && !loading && (
            <div className="px-5 pb-2 shrink-0">
              <button
                onClick={() => setShowPast((v) => !v)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  showPast
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                }`}
              >
                {showPast
                  ? `全期間を表示中${pastCount > 0 ? `（過去 ${pastCount} 件を含む）` : ''}`
                  : `今日以降を表示中${pastCount > 0 ? `（過去 ${pastCount} 件を非表示）` : ''}`}
              </button>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-auto px-5 pb-5">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-400 animate-pulse">
                読み込み中...
              </div>
            ) : !selected ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <User size={32} className="opacity-30" />
                <p className="text-sm">メンバーを選択してください</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <CalendarDays size={32} className="opacity-30" />
                <p className="text-sm">{selected} の{showPast ? '担当予定はありません' : '今後の担当予定はありません'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-[500px] text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">日付</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">種別</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">章・タイトル</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">役割</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ seminar, role }, i) => {
                      const cfg = getEventConfig(seminar);
                      const dateLabel = format(
                        new Date(seminar.date + 'T00:00:00'),
                        'M月d日（E）',
                        { locale: ja }
                      );
                      return (
                        <tr
                          key={`${seminar.id}-${role}`}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            i % 2 === 0 ? '' : 'bg-gray-50/40'
                          }`}
                        >
                          <td className="py-2.5 px-2 whitespace-nowrap text-gray-700 font-medium text-xs sm:text-sm">
                            <p>{dateLabel}</p>
                            {seminar.start_time && (
                              <p className="text-[10px] text-indigo-500 font-semibold tabular-nums mt-0.5">
                                {seminar.start_time}{seminar.end_time ? `〜${seminar.end_time}` : '〜'}
                              </p>
                            )}
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                              {seminar.type === 'other' ? (seminar.custom_label || 'その他') : cfg.shortLabel}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-gray-800 text-xs sm:text-sm">
                            {seminar.title || '—'}
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-semibold ${ROLE_STYLE[role]}`}>
                              {role}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-gray-500 text-xs hidden sm:table-cell max-w-[160px] truncate">
                            {seminar.notes || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
