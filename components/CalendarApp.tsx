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
import { SeminarFormData } from '@/lib/types';

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const [sems, mems] = await Promise.all([getSeminars(monthKey), getMembers()]);
      setSeminars(sems);
      setMembers(mems);
    } catch (e) {
      console.error(e);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

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
      if (editingSeminar) {
        const updated = await updateSeminar(editingSeminar.id, data);
        setSeminars((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await createSeminar(data);
        if (created.date.startsWith(monthKey)) {
          setSeminars((prev) => [...prev, created].sort((a, b) => a.date.localeCompare(b.date)));
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
    <div className="flex flex-col h-dvh">
      {/* ── App Header ── */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-sm">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">ゼ</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate">
              班ゼミカレンダー
            </h1>
            <p className="text-xs text-gray-500 leading-tight">2026</p>
          </div>
        </div>

        {/* Center: Legend (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 mx-4">
          {[
            { color: 'bg-indigo-500', label: '輪読ゼミ' },
            { color: 'bg-violet-500', label: '全体ゼミ' },
            { color: 'bg-teal-500',   label: '研究共有' },
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

      {/* ── Calendar ── */}
      <main className="flex-1 overflow-hidden min-h-0">
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
