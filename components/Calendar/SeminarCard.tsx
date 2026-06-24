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

      {/* Assignees — always show all roles, truncate gracefully */}
      {assignees.length > 0 && (
        <div className="mt-0.5 flex flex-col gap-y-0.5 pl-2.5">
          {(['a', 'b', 'c'] as const).map((role) => {
            const name = seminar[`assignee_${role}`];
            if (!name) return null;
            return (
              <span key={role} className="text-xs opacity-80 truncate leading-tight">
                <span className="font-bold opacity-50 mr-0.5 uppercase">{role}</span>
                {name}
              </span>
            );
          })}
        </div>
      )}
    </button>
  );
}
