'use client';

import { useState, useRef } from 'react';
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
import { getEventConfig } from '@/lib/activity-config';
import { compareSeminarsWithinDay } from '@/lib/seminar-sort';
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
  /** Direction the new month slides in from (for CSS animation). Omit on first render to suppress initial animation. */
  slideDir?: 'prev' | 'next';
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** Min horizontal distance (px) to trigger swipe. */
const SWIPE_THRESHOLD = 48;
/** Min horizontal velocity (px/ms) — triggers even for short fast flicks. */
const SWIPE_VELOCITY = 0.25;

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
  slideDir,
}: Props) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // ── Swipe gesture — ref-based to avoid React re-renders during drag ────────
  const gridRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const swipeLocked = useRef<'horizontal' | 'vertical' | null>(null);
  // Holds the transitionend cleanup fn so we can cancel it on the next touch
  const springCleanupRef = useRef<(() => void) | null>(null);

  const cancelSpring = () => {
    if (springCleanupRef.current && gridRef.current) {
      gridRef.current.removeEventListener('transitionend', springCleanupRef.current);
      springCleanupRef.current = null;
    }
    if (gridRef.current) {
      gridRef.current.style.transition = '';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    cancelSpring();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    swipeLocked.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Lock direction on first meaningful movement (10px threshold avoids jitter)
    if (!swipeLocked.current) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        swipeLocked.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }
    }

    if (swipeLocked.current === 'horizontal' && gridRef.current) {
      // 0.4× damping: tactile drag feedback without committing
      gridRef.current.style.transform = `translateX(${dx * 0.4}px)`;
      gridRef.current.style.willChange = 'transform';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null ||
      touchStartTime.current === null
    ) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dt = Math.max(1, Date.now() - touchStartTime.current);
    const vx = Math.abs(dx) / dt;
    const triggered =
      swipeLocked.current === 'horizontal' &&
      (Math.abs(dx) > SWIPE_THRESHOLD || vx > SWIPE_VELOCITY);

    if (triggered) {
      // Month changes → grid remounts; clear style before unmount
      if (gridRef.current) {
        gridRef.current.style.transform = '';
        gridRef.current.style.willChange = 'auto';
      }
      if (dx > 0) onPrevMonth();
      else onNextMonth();
    } else if (swipeLocked.current === 'horizontal' && gridRef.current) {
      // Spring back with smooth ease-out transition
      const el = gridRef.current;
      const cleanup = () => {
        el.style.transition = '';
        el.style.willChange = 'auto';
        springCleanupRef.current = null;
      };
      springCleanupRef.current = cleanup;
      el.addEventListener('transitionend', cleanup, { once: true });
      el.style.transition = 'transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.transform = 'translateX(0)';
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchStartTime.current = null;
    swipeLocked.current = null;
  };

  const handleTouchCancel = () => {
    if (swipeLocked.current === 'horizontal' && gridRef.current) {
      const el = gridRef.current;
      const cleanup = () => {
        el.style.transition = '';
        el.style.willChange = 'auto';
        springCleanupRef.current = null;
      };
      springCleanupRef.current = cleanup;
      el.addEventListener('transitionend', cleanup, { once: true });
      el.style.transition = 'transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.transform = 'translateX(0)';
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchStartTime.current = null;
    swipeLocked.current = null;
  };

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
  Object.values(seminarsByDate).forEach((items) => {
    items.sort(compareSeminarsWithinDay);
  });

  // Grid remounts when month changes → CSS slide animation replays
  const gridKey = format(currentMonth, 'yyyy-MM');
  const gridAnimClass = slideDir === 'next'
    ? 'cal-slide-next'
    : slideDir === 'prev'
    ? 'cal-slide-prev'
    : '';

  return (
    <div
      className="flex flex-col select-none outline-none"
      tabIndex={0}
      style={{ touchAction: 'pan-y' }}
      onKeyDown={(e) => {
        // Arrow keys navigate months when calendar wrapper is focused
        if (e.key === 'ArrowLeft') { onPrevMonth(); e.preventDefault(); }
        if (e.key === 'ArrowRight') { onNextMonth(); e.preventDefault(); }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div className="shrink-0">
        {/* Month Navigation Header */}
        <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToday}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 px-3 py-2 sm:py-1.5 rounded-lg border border-slate-300 transition-colors shrink-0 bg-white/40 backdrop-blur-xs"
          >
            今日
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevMonth}
              className="p-2.5 sm:p-1.5 rounded-lg hover:bg-white/60 active:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors touch-manipulation"
              aria-label="前の月"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2.5 sm:p-1.5 rounded-lg hover:bg-white/60 active:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors touch-manipulation"
              aria-label="次の月"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 min-w-0 truncate">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })}
          </h2>
          {loading && (
            <span className="ml-auto hidden min-[360px]:inline text-xs text-indigo-500 font-medium animate-pulse">読み込み中...</span>
          )}
        </div>

        {/* Weekday Header */}
        <div className="grid grid-cols-7 bg-slate-100/50 backdrop-blur-xs border-b border-slate-200/60">
          {WEEKDAYS.map((day, i) => (
            <div
              key={day}
              className={`py-2 text-center text-xs font-bold tracking-wide
                ${i === 0 ? 'text-red-500/90' : ''}
                ${i === 6 ? 'text-blue-500/90' : ''}
                ${i > 0 && i < 6 ? 'text-slate-500' : ''}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid — remounts on month change to replay slide animation.
          Transform during drag is applied directly via gridRef (no React state). */}
      <div
        ref={gridRef}
        key={gridKey}
        className={`calendar-month-grid grid grid-cols-7 border-l border-t border-slate-200/60 ${gridAnimClass}`}
      >
        {days.map((day) => {
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
                relative border-r border-b border-slate-200/60 transition-all duration-150 touch-manipulation
                ${hasPopup ? 'overflow-visible' : 'overflow-hidden'}
                ${!isCurrentMonth
                  ? 'bg-slate-50/40 cursor-default text-slate-400/60'
                  : `cursor-pointer ${
                      isCurrentDay
                        ? isHovered ? 'bg-indigo-100/40' : 'bg-indigo-50/30 active:bg-indigo-100/30'
                        : isHovered ? 'bg-slate-50/70' : 'bg-white/60 active:bg-slate-100/40'
                    }`
                }
                ${isCurrentDay ? 'border-l-2 border-l-indigo-500' : ''}
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
              <div className="flex items-start justify-between px-1.5 sm:px-1 pt-1 pb-0">
                <div className="flex flex-col items-start leading-none gap-0.5 min-w-0">
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
                    <span className="text-[8px] font-bold text-indigo-500 leading-none">
                      今日
                    </span>
                  )}
                  {/* Mobile only: time hint (chips show type/title; desktop SeminarCard shows time) */}
                  {isCurrentMonth && earliestTime && (
                    <span className="sm:hidden text-[9px] text-indigo-500 font-semibold tabular-nums leading-none">
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

              {/* Mobile: readable compact event chips (tap day to see details) */}
              {daySeminars.length > 0 && (
                <div className="sm:hidden mt-1 space-y-0.5 px-1 pb-1">
                  {daySeminars.slice(0, 2).map((seminar) => {
                    const cfg = getEventConfig(seminar);
                    const label = seminar.type === 'other'
                      ? (seminar.custom_label || 'その他')
                      : cfg.shortLabel;
                    return (
                      <div
                        key={seminar.id}
                        className={`
                          min-w-0 rounded border px-1 py-0.5 leading-none
                          ${isCurrentMonth
                            ? `${cfg.bgClass} ${cfg.borderClass}`
                            : 'bg-gray-100/50 border-gray-200/60 opacity-60'
                          }
                        `}
                      >
                        <div className="flex items-center gap-0.5 min-w-0">
                          <span
                            className={`
                              w-1.5 h-1.5 rounded-full shrink-0
                              ${isCurrentMonth ? cfg.dotClass : 'bg-gray-300'}
                            `}
                          />
                          <span
                            className={`
                              truncate text-[10px] font-semibold
                              ${isCurrentMonth ? cfg.textClass : 'text-gray-400'}
                            `}
                          >
                            {label}
                          </span>
                        </div>
                        {seminar.title && (
                          <p
                            className={`
                              mt-0.5 truncate text-[9px]
                              ${isCurrentMonth ? `${cfg.textClass} opacity-70` : 'text-gray-400/80'}
                            `}
                          >
                            {seminar.title}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {daySeminars.length > 2 && (
                    <div className="text-[10px] font-semibold text-gray-400 leading-none px-1 pt-0.5">
                      +{daySeminars.length - 2}件
                    </div>
                  )}
                </div>
              )}

              {/* Desktop: full SeminarCards with hover popup */}
              {daySeminars.length > 0 && (
                <div className={`hidden sm:block px-1 space-y-0.5 mt-0.5 ${hasPopup ? 'bg-white shadow-md rounded-b-lg pb-2' : 'pb-1'}`}>
                  {daySeminars.map((seminar) => (
                    <div key={seminar.id}>
                      <SeminarCard
                        seminar={seminar}
                        disabled={!isCurrentMonth}
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
