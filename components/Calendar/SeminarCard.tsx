'use client';

import { Seminar, SEMINAR_TYPES, normalizeAssigneeB } from '@/lib/types';

interface Props {
  seminar: Seminar;
  onClick: (e: React.MouseEvent) => void;
}

export default function SeminarCard({ seminar, onClick }: Props) {
  const cfg = SEMINAR_TYPES[seminar.type];
  const bNames = normalizeAssigneeB(seminar.assignee_b);
  const hasAssignees = seminar.assignee_a || bNames.length > 0 || seminar.assignee_c;
  const displayLabel = seminar.type === 'other'
    ? (seminar.custom_label || 'その他')
    : cfg.shortLabel;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-md px-1.5 py-1 border text-xs
        ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ${cfg.hoverClass}
        transition-all duration-150 group/card
        hover:shadow-sm active:scale-95
      `}
    >
      <div className="flex items-center gap-1 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass} shrink-0`} />
        <span className="font-semibold truncate">{displayLabel}</span>
        {seminar.title && (
          <span className="text-xs opacity-70 truncate hidden sm:inline">
            {seminar.title}
          </span>
        )}
      </div>

      {/* Assignees */}
      {hasAssignees && (
        <div className="mt-0.5 flex flex-col gap-y-0.5 pl-2.5">
          {seminar.assignee_a && (
            <span className="text-xs opacity-80 truncate leading-tight">
              <span className="font-bold opacity-50 mr-0.5 uppercase">a</span>
              {seminar.assignee_a}
            </span>
          )}
          {bNames.length > 0 && (
            <span className="text-xs opacity-80 truncate leading-tight">
              <span className="font-bold opacity-50 mr-0.5 uppercase">b</span>
              {bNames.join('・')}
            </span>
          )}
          {seminar.assignee_c && (
            <span className="text-xs opacity-80 truncate leading-tight">
              <span className="font-bold opacity-50 mr-0.5 uppercase">c</span>
              {seminar.assignee_c}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
