'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth } from 'date-fns';
import { Users } from 'lucide-react';
import { Seminar, Member } from '@/lib/types';
import { getSeminars, createSeminar, updateSeminar, deleteSeminar, getMembers } from '@/lib/api';
import CalendarView from './Calendar/CalendarView';
import SeminarModal from './Modals/SeminarModal';
import MembersModal from './Modals/MembersModal';
import DayDetailModal from './Modals/DayDetailModal';
import { SeminarFormData } from '@/lib/types';

export default function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // DayDetail modal state
  const [dayDetailOpen, setDayDetailOpen] = useState(false);
  const [dayDetailDate, setDayDetailDate] = useState('');

  // Seminar modal state
  const [seminarModalOpen, setSeminarModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
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
  /** カレンダーの日付セルをクリック → DayDetailModal を開く */
  const handleDayClick = (dateStr: string) => {
    setDayDetailDate(dateStr);
    setDayDetailOpen(true);
  };

  /** DayDetailModal の「予定を追加」ボタン → SeminarModal（新規）を開く */
  const handleDayDetailAdd = () => {
    setDayDetailOpen(false);
    setEditingSeminar(null);
    setDefaultDate(dayDetailDate);
    setSavingError(null);
    setSeminarModalOpen(true);
  };

  /** DayDetailModal の予定カードをクリック → SeminarModal（編集）を開く */
  const handleDayDetailEdit = (seminar: Seminar) => {
    setDayDetailOpen(false);
    setEditingSeminar(seminar);
    setDefaultDate(seminar.date);
    setSavingError(null);
    setSeminarModalOpen(true);
  };

  // ── Quick add (+ button on calendar cell) ────────────
  /** カレンダーの + ボタン → SeminarModal（新規）を直接開く */
  const handleQuickAdd = (dateStr: string) => {
    setEditingSeminar(null);
    setDefaultDate(dateStr);
    setSavingError(null);
    setSeminarModalOpen(true);
  };

  // ── Seminar card click on calendar (direct edit) ─────
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

  // Seminars for the selected day (used by DayDetailModal)
  const dayDetailSeminars = seminars.filter((s) => s.date === dayDetailDate);

  return (
    <div className="flex flex-col h-screen">
      {/* ── App Header ── */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">ゼ</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">班ゼミカレンダー</h1>
            <p className="text-xs text-gray-500 leading-tight">2026</p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
            <span className="text-xs text-gray-600">輪読ゼミ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
            <span className="text-xs text-gray-600">全体ゼミ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
            <span className="text-xs text-gray-600">研究共有</span>
          </div>
        </div>

        <button
          onClick={() => setMembersModalOpen(true)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Users size={16} />
          <span className="hidden sm:inline">メンバー管理</span>
        </button>
      </header>

      {/* ── Fetch Error Banner ── */}
      {fetchError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between">
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
      <main className="flex-1 overflow-hidden">
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

      {/* ── Day Detail Modal ── */}
      <DayDetailModal
        open={dayDetailOpen}
        dateStr={dayDetailDate}
        seminars={dayDetailSeminars}
        onClose={() => setDayDetailOpen(false)}
        onAdd={handleDayDetailAdd}
        onEdit={handleDayDetailEdit}
      />

      {/* ── Seminar Modal ── */}
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

      {/* ── Members Modal ── */}
      <MembersModal
        open={membersModalOpen}
        members={members}
        onClose={() => setMembersModalOpen(false)}
        onChange={handleMembersChange}
      />
    </div>
  );
}
