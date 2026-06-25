'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Seminar, SEMINAR_TYPES } from '@/lib/types';
import SeminarCard from './SeminarCard';

interface Props {
  currentMonth: Date;
  seminars: Seminar[];
  loading: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDayClick: (dateStr: string) => void;
  onQuickAdd: (dateStr: string) => void;
  onSeminarClick: (seminar: Seminar) => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarView({
  currentMonth,
  seminars,
  loading,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDayClick,
  onQuickAdd,
  onSeminarClick,
}: Props) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const seminarsByDate: Record<string, Seminar[]> = {};
  seminars.forEach((s) => {
    if (!seminarsByDate[s.date]) seminarsByDate[s.date] = [];
    seminarsByDate[s.date].push(s);
  });

  return (
    <div className="flex flex-col">
      <div className="shrink-0">
        {/* Month Navigation Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={onToday}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300 transition-colors"
          >
            今日
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevMonth}
              className="p-2.5 sm:p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
              aria-label="前の月"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2.5 sm:p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
              aria-label="次の月"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })}
          </h2>
          {loading && (
            <span className="ml-auto text-xs text-gray-400 animate-pulse">読み込み中...</span>
          )}
        </div>

        {/* Weekday Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {WEEKDAYS.map((day, i) => (
            <div
              key={day}
              className={`py-2 text-center text-xs font-semibold tracking-wide
                ${i === 0 ? 'text-red-500' : ''}
                ${i === 6 ? 'text-blue-500' : ''}
                ${i > 0 && i < 6 ? 'text-gray-500' : ''}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid — fixed row height so cells never expand beyond clamp value */}
      <div className="grid grid-cols-7 border-l border-t border-gray-200"
        style={{ gridAutoRows: 'clamp(80px, 14vw, 120px)' }}
      >
        {days.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          const daySeminars = seminarsByDate[dateStr] ?? [];
          const dayOfWeek = day.getDay(); // 0=Sun, 6=Sat
          const earliestTime = daySeminars
            .map((s) => s.start_time)
            .filter(Boolean)
            .sort()[0] ?? null;

          const isHovered = hoveredDate === dateStr;
          // Only show popup when there are seminars — prevents empty-cell white-box artifact
          const hasPopup = isHovered && daySeminars.length > 0;

          return (
            <div
              key={dateStr}
              className={`
                relative border-r border-b border-gray-200 transition-colors cursor-pointer touch-manipulation
                ${hasPopup ? 'overflow-visible' : 'overflow-hidden'}
                ${!isCurrentMonth
                  ? 'bg-gray-50 active:bg-gray-100'
                  : isCurrentDay
                  ? isHovered ? 'bg-indigo-100/70' : 'bg-indigo-50 active:bg-indigo-100'
                  : isHovered ? 'bg-indigo-50/30' : 'bg-white active:bg-indigo-50/50'
                }
                ${isCurrentDay ? 'border-l-2 border-l-indigo-400' : ''}
              `}
              style={{ zIndex: hasPopup ? 20 : undefined }}
              onMouseMove={(e) => {
                if (!isCurrentMonth) return;
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.clientY <= rect.bottom) {
                  if (hoveredDate !== dateStr) setHoveredDate(dateStr);
                } else {
                  if (hoveredDate === dateStr) setHoveredDate(null);
                }
              }}
              onMouseLeave={() => {
                if (hoveredDate === dateStr) setHoveredDate(null);
              }}
              onClick={() => isCurrentMonth && onDayClick(dateStr)}
            >
              {/* Header: date + time stacked on left, quickadd on right */}
              <div className="flex items-start justify-between px-1 pt-1 pb-0">
                <div className="flex flex-col items-start leading-none gap-px">
                  <span
                    className={`
                      text-xs sm:text-sm font-medium w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full shrink-0
                      ${isCurrentDay
                        ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-200 ring-offset-1 shadow-sm'
                        : !isCurrentMonth
                        ? 'text-gray-300'
                        : dayOfWeek === 0
                        ? 'text-red-400'
                        : dayOfWeek === 6
                        ? 'text-blue-400'
                        : 'text-gray-700'
                      }
                    `}
                  >
                    {format(day, 'd')}
                  </span>
                  {isCurrentDay && (
                    <span className="text-[8px] font-bold text-indigo-500 leading-none tracking-wide">
                      今日
                    </span>
                  )}
                  {earliestTime && (
                    <span className="text-[9px] sm:text-[10px] text-indigo-400 font-semibold tabular-nums leading-none">
                      {earliestTime}〜
                    </span>
                  )}
                </div>

                {/* Quick-add button: desktop hover only (tap-day flow handles mobile) */}
                {isCurrentMonth && (
                  <button
                    className={`hidden sm:flex transition-opacity w-6 h-6 rounded-full bg-indigo-100 hover:bg-indigo-200 active:bg-indigo-300 text-indigo-600 items-center justify-center text-sm leading-none shrink-0 focus-visible:opacity-100 ${isHovered ? '' : 'sm:opacity-0'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(dateStr);
                    }}
                    title="予定を追加"
                    aria-label="予定を追加"
                  >
                    +
                  </button>
                )}
              </div>

              {/* Seminar Events
                  Mobile  → thin segmented color bar at cell bottom (tap to see details)
                  Desktop → full SeminarCards with hover popup */}

              {/* Mobile: segmented color bar (one segment per event type, up to 4) */}
              {isCurrentMonth && daySeminars.length > 0 && (
                <div className="sm:hidden absolute bottom-0 inset-x-0 h-[3px] flex overflow-hidden">
                  {daySeminars.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className={`flex-1 h-full ${SEMINAR_TYPES[s.type]?.dotClass ?? 'bg-gray-400'}`}
                    />
                  ))}
                </div>
              )}

              {/* Desktop: full SeminarCards with hover popup */}
              {daySeminars.length > 0 && (
                <div className={`hidden sm:block px-1 space-y-0.5 mt-0.5 ${hasPopup ? 'bg-white shadow-md rounded-b-lg pb-2' : 'pb-1'}`}>
                  {daySeminars.map((seminar) => (
                    <div key={seminar.id}>
                      <SeminarCard
                        seminar={seminar}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeminarClick(seminar);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
