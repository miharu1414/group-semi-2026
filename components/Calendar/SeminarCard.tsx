'use client';

import { Seminar, normalizeAssigneeB } from '@/lib/types';
import { getEventConfig } from '@/lib/activity-config';

interface Props {
  seminar: Seminar;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export default function SeminarCard({ seminar, onClick, disabled }: Props) {
  const cfg = getEventConfig(seminar);
  const bNames = normalizeAssigneeB(seminar.assignee_b);
  const hasAssignees = seminar.assignee_a || bNames.length > 0 || seminar.assignee_c;
  const displayLabel = seminar.type === 'other'
    ? (seminar.custom_label || 'その他')
    : cfg.shortLabel;

  const cardContent = (
    <>
      <div className="flex items-center gap-1 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full ${disabled ? 'bg-gray-300' : cfg.dotClass} shrink-0`} />
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
    </>
  );

  if (disabled) {
    return (
      <div
        className="
          w-full text-left rounded-md px-1.5 py-1 border text-xs
          bg-gray-100/50 text-gray-400 border-gray-200/60 opacity-60
          transition-all duration-150 select-none
        "
      >
        {cardContent}
      </div>
    );
  }

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
      {cardContent}
    </button>
  );
}
