'use client';

import { Seminar, SEMINAR_TYPES } from '@/lib/types';

interface Props {
  seminar: Seminar;
  onClick: (e: React.MouseEvent) => void;
}

export default function SeminarCard({ seminar, onClick }: Props) {
  const cfg = SEMINAR_TYPES[seminar.type];
  const assignees = [seminar.assignee_a, seminar.assignee_b, seminar.assignee_c].filter(Boolean);

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
        <span className="font-semibold truncate">{cfg.shortLabel}</span>
        {seminar.title && (
          <span className="text-xs opacity-70 truncate hidden sm:inline">
            {seminar.title}
          </span>
        )}
      </div>

      {/* Assignees */}
      {assignees.length > 0 && (
        <div className="mt-0.5 flex flex-wrap gap-x-1.5 gap-y-0.5 pl-2.5">
          {seminar.assignee_a && (
            <span className="text-xs opacity-80 truncate">
              <span className="font-semibold opacity-60">A</span> {seminar.assignee_a}
            </span>
          )}
          {seminar.assignee_b && (
            <span className="text-xs opacity-80 truncate hidden sm:inline">
              <span className="font-semibold opacity-60">B</span> {seminar.assignee_b}
            </span>
          )}
          {seminar.assignee_c && (
            <span className="text-xs opacity-80 truncate hidden md:inline">
              <span className="font-semibold opacity-60">C</span> {seminar.assignee_c}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
