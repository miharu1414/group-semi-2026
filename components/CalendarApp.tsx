'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth } from 'date-fns';
import { Users, BookOpen, User } from 'lucide-react';
import { Seminar, Member } from '@/lib/types';
import { getSeminars, createSeminar, updateSeminar, deleteSeminar, getMembers } from '@/lib/api';
import CalendarView from './Calendar/CalendarView';
import SeminarModal from './Modals/SeminarModal';
import MembersModal from './Modals/MembersModal';
import DayDetailModal from './Modals/DayDetailModal';
import InfoModal from './Modals/InfoModal';
import MemberScheduleModal from './Modals/MemberScheduleModal';
import NoticeBoard from './NoticeBoard';
import { SeminarFormData } from '@/lib/types';
import { compareSeminars } from '@/lib/seminar-sort';

function sortSeminars(items: Seminar[]) {
  return [...items].sort(compareSeminars);
}

export default function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // DayDetail modal
  const [dayDetailOpen, setDayDetailOpen] = useState(false);
  const [dayDetailDate, setDayDetailDate] = useState('');

  // Seminar modal
  const [seminarModalOpen, setSeminarModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [memberScheduleOpen, setMemberScheduleOpen] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<Seminar | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>('');
  const [savingError, setSavingError] = useState<string | null>(null);

  const monthKey = format(currentMonth, 'yyyy-MM');

  const prevMonth = new Date(currentMonth);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  const prevMonthKey = format(prevMonth, 'yyyy-MM');

  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthKey = format(nextMonth, 'yyyy-MM');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const [semsCur, semsPrev, semsNext, mems] = await Promise.all([
        getSeminars(monthKey),
        getSeminars(prevMonthKey),
        getSeminars(nextMonthKey),
        getMembers(),
      ]);
      setSeminars(sortSeminars([...semsCur, ...semsPrev, ...semsNext]));
      setMembers(mems);
    } catch (e) {
      console.error(e);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [monthKey, prevMonthKey, nextMonthKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Calendar navigation ──────────────────────────────
  const handlePrevMonth = () => {
    setCurrentMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() - 1);
      return startOfMonth(d);
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() + 1);
      return startOfMonth(d);
    });
  };

  const handleToday = () => {
    setCurrentMonth(startOfMonth(new Date()));
  };

  // ── Day Detail Modal ─────────────────────────────────
  const handleDayClick = (dateStr: string) => {
    setDayDetailDate(dateStr);
    setDayDetailOpen(true);
  };

  const handleDayDetailAdd = () => {
    setDayDetailOpen(false);
    setEditingSeminar(null);
    setDefaultDate(dayDetailDate);
    setSavingError(null);
    setSeminarModalOpen(true);
  };

  const handleDayDetailEdit = (seminar: Seminar) => {
    setDayDetailOpen(false);
    setEditingSeminar(seminar);
    setDefaultDate(seminar.date);
    setSavingError(null);
    setSeminarModalOpen(true);
  };

  // ── Quick add ────────────────────────────────────────
  const handleQuickAdd = (dateStr: string) => {
    setEditingSeminar(null);
    setDefaultDate(dateStr);
    setSavingError(null);
    setSeminarModalOpen(true);
  };

  const handleSeminarClick = (seminar: Seminar) => {
    setEditingSeminar(seminar);
    setDefaultDate(seminar.date);
    setSavingError(null);
    setSeminarModalOpen(true);
  };

  // ── Seminar CRUD ─────────────────────────────────────
  const handleSeminarSave = async (data: SeminarFormData) => {
    setSavingError(null);
    try {
      const isVisibleDate = (date: string) =>
        date.startsWith(monthKey) || date.startsWith(prevMonthKey) || date.startsWith(nextMonthKey);

      if (editingSeminar) {
        const updated = await updateSeminar(editingSeminar.id, data);
        setSeminars((prev) => {
          const next = isVisibleDate(updated.date)
            ? prev.map((s) => (s.id === updated.id ? updated : s))
            : prev.filter((s) => s.id !== updated.id);
          return sortSeminars(next);
        });
      } else {
        const created = await createSeminar(data);
        if (isVisibleDate(created.date)) {
          setSeminars((prev) => sortSeminars([...prev, created]));
        }
      }
      setSeminarModalOpen(false);
      setEditingSeminar(null);
    } catch (e) {
      setSavingError('保存に失敗しました。もう一度お試しください。');
      console.error(e);
    }
  };

  const handleSeminarDelete = async (id: string) => {
    try {
      await deleteSeminar(id);
      setSeminars((prev) => prev.filter((s) => s.id !== id));
      setSeminarModalOpen(false);
      setEditingSeminar(null);
    } catch (e) {
      setSavingError('削除に失敗しました。');
      console.error(e);
    }
  };

  const handleMembersChange = (updated: Member[]) => {
    setMembers(updated);
  };

  const dayDetailSeminars = seminars.filter((s) => s.date === dayDetailDate);

  return (
    <div className="flex flex-col h-dvh relative">
      {/* ── Decorative Background spots ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50/50">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-tr from-teal-500/5 to-transparent blur-[100px]" />
      </div>

      {/* ── App Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-sm z-30">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8.5 h-8.5 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 leading-tight truncate">
              班ゼミカレンダー
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 leading-tight mt-0.5">2026</p>
          </div>
        </div>

        {/* Center: Legend (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 mx-4">
          {[
            { color: 'bg-indigo-500', label: '輪読ゼミ' },
            { color: 'bg-violet-500', label: '全体ゼミ' },
            { color: 'bg-teal-500',   label: '研究共有' },
            { color: 'bg-orange-500', label: 'その他' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setInfoModalOpen(true)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 sm:px-3 sm:py-1.5 rounded-lg transition-colors"
            title="ゼミ概要・役割説明"
            aria-label="ゼミ概要・役割説明"
          >
            <BookOpen size={17} />
            <span className="hidden sm:inline text-sm">概要</span>
          </button>

          <button
            onClick={() => setMemberScheduleOpen(true)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 p-2 sm:px-3 sm:py-1.5 rounded-lg transition-colors"
            title="担当一覧"
            aria-label="担当一覧"
          >
            <User size={17} />
            <span className="hidden sm:inline text-sm">担当確認</span>
          </button>

          <button
            onClick={() => setMembersModalOpen(true)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 sm:px-3 sm:py-1.5 rounded-lg transition-colors"
            title="メンバー管理"
            aria-label="メンバー管理"
          >
            <Users size={17} />
            <span className="hidden sm:inline text-sm">メンバー</span>
          </button>
        </div>
      </header>

      {/* ── Fetch Error Banner ── */}
      {fetchError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between shrink-0">
          <span className="text-sm text-red-700">データの読み込みに失敗しました。</span>
          <button
            onClick={fetchData}
            className="text-sm text-red-700 font-semibold underline hover:no-underline"
          >
            再試行
          </button>
        </div>
      )}

      {/* ── Calendar + Notice Board (main scrolls to show all weeks) ── */}
      <main className="flex-1 overflow-y-auto min-h-0">
        <CalendarView
          currentMonth={currentMonth}
          seminars={seminars}
          loading={loading}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onDayClick={handleDayClick}
          onQuickAdd={handleQuickAdd}
          onSeminarClick={handleSeminarClick}
        />
        <NoticeBoard />
      </main>

      {/* ── Modals ── */}
      <DayDetailModal
        open={dayDetailOpen}
        dateStr={dayDetailDate}
        seminars={dayDetailSeminars}
        onClose={() => setDayDetailOpen(false)}
        onAdd={handleDayDetailAdd}
        onEdit={handleDayDetailEdit}
      />

      <SeminarModal
        open={seminarModalOpen}
        seminar={editingSeminar}
        defaultDate={defaultDate}
        members={members}
        error={savingError}
        onClose={() => {
          setSeminarModalOpen(false);
          setEditingSeminar(null);
          setSavingError(null);
        }}
        onSave={handleSeminarSave}
        onDelete={handleSeminarDelete}
      />

      <MembersModal
        open={membersModalOpen}
        members={members}
        onClose={() => setMembersModalOpen(false)}
        onChange={handleMembersChange}
      />

      <InfoModal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />

      <MemberScheduleModal
        open={memberScheduleOpen}
        members={members}
        onClose={() => setMemberScheduleOpen(false)}
      />
    </div>
  );
}
