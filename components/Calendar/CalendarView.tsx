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

/** Min horizontal distance (px) to trigger touch swipe. */
const SWIPE_THRESHOLD = 48;
/** Min horizontal velocity (px/ms) — triggers even for short fast flicks. */
const SWIPE_VELOCITY = 0.25;
/** Wheel deltaX to accumulate before triggering month change (trackpad). */
const WHEEL_THRESHOLD = 60;
/** Minimum ms between wheel-triggered month changes. */
const WHEEL_COOLDOWN_MS = 500;

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

  // ── Adjacent month labels for hint pills ─────────────────────────────────
  const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  // ── Touch swipe — ref-based to avoid React re-renders during drag ─────────
  const gridRef = useRef<HTMLDivElement>(null);
  const prevHintRef = useRef<HTMLDivElement>(null);
  const nextHintRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const swipeLocked = useRef<'horizontal' | 'vertical' | null>(null);
  // Holds the transitionend cleanup fn so we can cancel it on the next touch
  const springCleanupRef = useRef<(() => void) | null>(null);

  // ── Trackpad wheel swipe ──────────────────────────────────────────────────
  const wheelAccumRef = useRef(0);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWheelTriggerRef = useRef(0);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Reset both hint pills to invisible. */
  const hideHints = () => {
    [prevHintRef.current, nextHintRef.current].forEach((el) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-50%) scale(0.82)';
    });
  };

  /** Cancel any in-progress spring-back transition on the grid. */
  const cancelSpring = () => {
    if (springCleanupRef.current && gridRef.current) {
      gridRef.current.removeEventListener('transitionend', springCleanupRef.current);
      springCleanupRef.current = null;
    }
    if (gridRef.current) {
      gridRef.current.style.transition = '';
    }
  };

  // ── Touch handlers ────────────────────────────────────────────────────────

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

    // Lock direction on first meaningful movement (10px avoids jitter)
    if (!swipeLocked.current) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        swipeLocked.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }
    }

    if (swipeLocked.current === 'horizontal' && gridRef.current) {
      const offset = dx * 0.5;
      // Slight opacity fade reinforces "leaving this month" sensation
      const fadeRatio = Math.max(0.82, 1 - Math.min(1, Math.abs(dx) / SWIPE_THRESHOLD) * 0.18);

      gridRef.current.style.transform = `translateX(${offset}px)`;
      gridRef.current.style.opacity = String(fadeRatio);
      gridRef.current.style.willChange = 'transform, opacity';

      // Progress-driven hint pill: grows and brightens as drag approaches threshold
      const progress = Math.min(1, Math.abs(dx) / SWIPE_THRESHOLD);
      const scale = 0.82 + progress * 0.18; // 0.82 → 1.0

      if (dx > 0) {
        // Swiping right → prev month appears from left
        if (prevHintRef.current) {
          prevHintRef.current.style.opacity = String(progress * 0.92);
          prevHintRef.current.style.transform = `translateY(-50%) scale(${scale})`;
        }
        if (nextHintRef.current) nextHintRef.current.style.opacity = '0';
      } else {
        // Swiping left → next month appears from right
        if (nextHintRef.current) {
          nextHintRef.current.style.opacity = String(progress * 0.92);
          nextHintRef.current.style.transform = `translateY(-50%) scale(${scale})`;
        }
        if (prevHintRef.current) prevHintRef.current.style.opacity = '0';
      }
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

    hideHints();

    if (triggered) {
      // Month changes → grid unmounts; clear DOM styles before that
      if (gridRef.current) {
        gridRef.current.style.transform = '';
        gridRef.current.style.opacity = '';
        gridRef.current.style.willChange = 'auto';
      }
      if (dx > 0) onPrevMonth();
      else onNextMonth();
    } else if (swipeLocked.current === 'horizontal' && gridRef.current) {
      // Spring back with smooth ease-out, restore opacity
      const el = gridRef.current;
      const cleanup = () => {
        el.style.transition = '';
        el.style.willChange = 'auto';
        springCleanupRef.current = null;
      };
      springCleanupRef.current = cleanup;
      el.addEventListener('transitionend', cleanup, { once: true });
      el.style.transition =
        'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchStartTime.current = null;
    swipeLocked.current = null;
  };

  const handleTouchCancel = () => {
    hideHints();
    if (swipeLocked.current === 'horizontal' && gridRef.current) {
      const el = gridRef.current;
      const cleanup = () => {
        el.style.transition = '';
        el.style.willChange = 'auto';
        springCleanupRef.current = null;
      };
      springCleanupRef.current = cleanup;
      el.addEventListener('transitionend', cleanup, { once: true });
      el.style.transition =
        'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchStartTime.current = null;
    swipeLocked.current = null;
  };

  // ── Trackpad wheel handler ────────────────────────────────────────────────

  const handleWheel = (e: React.WheelEvent) => {
    // Only handle strongly horizontal trackpad gestures; ignore mouse wheel (deltaX ≈ 0)
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.5 || Math.abs(e.deltaX) < 5) return;
    e.preventDefault();

    wheelAccumRef.current += e.deltaX;

    // Auto-reset accumulator if the gesture pauses
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    wheelTimerRef.current = setTimeout(() => {
      wheelAccumRef.current = 0;
    }, 350);

    const now = Date.now();
    if (now - lastWheelTriggerRef.current < WHEEL_COOLDOWN_MS) return;

    if (wheelAccumRef.current > WHEEL_THRESHOLD) {
      wheelAccumRef.current = 0;
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      lastWheelTriggerRef.current = now;
      onNextMonth();
    } else if (wheelAccumRef.current < -WHEEL_THRESHOLD) {
      wheelAccumRef.current = 0;
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      lastWheelTriggerRef.current = now;
      onPrevMonth();
    }
  };

  // ── Calendar layout data ──────────────────────────────────────────────────

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
      onWheel={handleWheel}
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

      {/* Grid wrapper — relative so hint pills can overlay the grid area.
          Transform/opacity during drag applied directly via gridRef (no React state). */}
      <div className="relative">
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

        {/* ── Swipe navigation hint pills ──────────────────────────────────────
            Always in DOM (opacity:0), shown via direct DOM manipulation during swipe.
            Zero React re-renders — all updates go through prevHintRef/nextHintRef.   */}
        <div
          ref={prevHintRef}
          style={{ opacity: 0, transform: 'translateY(-50%) scale(0.82)' }}
          className="absolute left-3 top-1/2 pointer-events-none z-30 select-none"
          aria-hidden="true"
        >
          <div className="bg-indigo-600/88 text-white rounded-2xl px-4 py-2.5 flex items-center gap-1.5 shadow-2xl text-sm font-bold backdrop-blur-sm border border-indigo-400/30">
            <ChevronLeft size={15} />
            <span>{format(prevMonthDate, 'M月', { locale: ja })}</span>
          </div>
        </div>

        <div
          ref={nextHintRef}
          style={{ opacity: 0, transform: 'translateY(-50%) scale(0.82)' }}
          className="absolute right-3 top-1/2 pointer-events-none z-30 select-none"
          aria-hidden="true"
        >
          <div className="bg-indigo-600/88 text-white rounded-2xl px-4 py-2.5 flex items-center gap-1.5 shadow-2xl text-sm font-bold backdrop-blur-sm border border-indigo-400/30">
            <span>{format(nextMonthDate, 'M月', { locale: ja })}</span>
            <ChevronRight size={15} />
          </div>
        </div>
      </div>
    </div>
  );
}
