'use client';

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
import { Seminar } from '@/lib/types';
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
    <div className="flex flex-col h-full">
      {/* Month Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={onToday}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300 transition-colors"
        >
          今日
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="前の月"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
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
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 shrink-0">
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

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 h-full" style={{ gridAutoRows: 'minmax(clamp(72px, 14vw, 120px), 1fr)' }}>
          {days.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);
            const daySeminars = seminarsByDate[dateStr] ?? [];
            const dayOfWeek = day.getDay(); // 0=Sun, 6=Sat

            return (
              <div
                key={dateStr}
                className={`
                  relative border-r border-b border-gray-200 group
                  overflow-hidden transition-colors cursor-pointer
                  ${!isCurrentMonth
                    ? 'bg-gray-50'
                    : isCurrentDay
                    ? 'bg-indigo-50 hover:bg-indigo-100/70'
                    : 'bg-white hover:bg-indigo-50/30'
                  }
                  ${isCurrentDay ? 'border-l-2 border-l-indigo-400' : idx % 7 === 0 ? 'border-l' : ''}
                `}
                onClick={() => isCurrentMonth && onDayClick(dateStr)}
              >
                {/* Day number + today badge */}
                <div className="flex items-start justify-between p-1.5 sm:p-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`
                        text-xs sm:text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full shrink-0
                        ${isCurrentDay
                          ? 'bg-indigo-600 text-white font-bold ring-4 ring-indigo-200 ring-offset-1 shadow-md'
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
                      <span className="text-[9px] font-bold text-indigo-500 leading-none tracking-wide">
                        今日
                      </span>
                    )}
                  </div>

                  {/* Quick-add button on hover */}
                  {isCurrentMonth && (
                    <button
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity w-6 h-6 sm:w-6 sm:h-6 rounded-full bg-indigo-100 hover:bg-indigo-200 active:bg-indigo-300 text-indigo-600 flex items-center justify-center text-sm leading-none shrink-0 mt-0.5 touch-manipulation"
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

                {/* Seminar Events */}
                <div className="px-1 pb-1 space-y-0.5">
                  {daySeminars.map((seminar) => (
                    <SeminarCard
                      key={seminar.id}
                      seminar={seminar}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeminarClick(seminar);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
