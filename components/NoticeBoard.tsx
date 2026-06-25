'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { Notice } from '@/lib/types';
import { getNotices, createNotice, updateNotice, deleteNotice } from '@/lib/api';

const MAX_BODY_LENGTH = 1000;
/** Show remaining counter when fewer than this many characters remain. */
const COUNTER_WARN_AT = 100;

function CharCounter({ value }: { value: string }) {
  const remaining = MAX_BODY_LENGTH - value.length;
  if (remaining > COUNTER_WARN_AT) return null;
  return (
    <span
      className={`text-xs tabular-nums font-medium ${
        remaining <= 20 ? 'text-red-500' : 'text-amber-500'
      }`}
    >
      {remaining}
    </span>
  );
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // 新規追加
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const newRef = useRef<HTMLTextAreaElement>(null);

  // 編集中
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // 削除確認（誤タップ防止）
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getNotices()
      .then(setNotices)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (adding) newRef.current?.focus();
  }, [adding]);

  // Auto-cancel delete confirmation after 3 s
  useEffect(() => {
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    if (confirmDeleteId) {
      confirmTimerRef.current = setTimeout(() => setConfirmDeleteId(null), 3000);
    }
    return () => { if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current); };
  }, [confirmDeleteId]);

  const handleAdd = async () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_BODY_LENGTH) return;
    setAddError(null);
    setSaving(true);
    try {
      const created = await createNotice(trimmed);
      setNotices((prev) => [...prev, created]);
      setNewText('');
      setAdding(false);
    } catch {
      setAddError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed.length > MAX_BODY_LENGTH) return;
    setEditError(null);
    try {
      const updated = await updateNotice(id, trimmed);
      setNotices((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setEditingId(null);
    } catch {
      setEditError('保存に失敗しました。もう一度お試しください。');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      // First tap: request confirmation
      setConfirmDeleteId(id);
      return;
    }
    // Second tap: confirmed
    setConfirmDeleteId(null);
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // Deletion failure is rare; silent retry is acceptable for now
    }
  };

  const startEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setEditText(notice.body);
    setEditError(null);
    setConfirmDeleteId(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditError(null); };

  return (
    <section className="border-t border-slate-200/80 bg-slate-50/60 backdrop-blur-md shrink-0 max-h-[28vh] flex flex-col">
      {/* Fixed header */}
      <div className="px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-slate-700">メモ・連絡事項</h2>
        <button
          onClick={() => { setAdding(true); setEditingId(null); setAddError(null); }}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/60 active:bg-indigo-100/60 px-2 py-2 sm:py-1 rounded-lg transition-colors touch-manipulation"
        >
          <Plus size={13} />
          追加
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-3">

        {/* Fetch error */}
        {fetchError && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-2 border border-red-200">
            <AlertCircle size={13} />
            メモの読み込みに失敗しました。
          </div>
        )}

        {/* New entry */}
        {adding && (
          <div className="mb-3">
            <div className="flex gap-2 items-start">
              <textarea
                ref={newRef}
                value={newText}
                onChange={(e) => { setNewText(e.target.value); setAddError(null); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd();
                  if (e.key === 'Escape') { setAdding(false); setNewText(''); setAddError(null); }
                }}
                rows={2}
                maxLength={MAX_BODY_LENGTH}
                placeholder="メモ・連絡事項を入力（Ctrl/Cmd+Enter で保存）"
                className="flex-1 rounded-lg border border-indigo-200/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none placeholder-slate-300 bg-white"
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleAdd}
                  disabled={saving || !newText.trim()}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white transition-colors shadow-sm"
                  aria-label="保存"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => { setAdding(false); setNewText(''); setAddError(null); }}
                  className="p-2 rounded-lg hover:bg-slate-200/60 text-slate-500 transition-colors"
                  aria-label="キャンセル"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1 px-0.5">
              {addError
                ? <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{addError}</span>
                : <span />
              }
              <CharCounter value={newText} />
            </div>
          </div>
        )}

        {/* Notice list */}
        {loading ? (
          <p className="text-xs text-slate-400 animate-pulse py-2">読み込み中...</p>
        ) : notices.length === 0 && !adding ? (
          <p className="text-xs text-slate-400 py-2">メモ・連絡事項はありません。「追加」から記入できます。</p>
        ) : (
          <ul className="space-y-2">
            {notices.map((notice) => (
              <li
                key={notice.id}
                className="group/item flex items-start gap-2 bg-white/90 rounded-xl border border-slate-200/80 px-3 py-2.5 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all duration-150"
              >
                {editingId === notice.id ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <textarea
                        value={editText}
                        onChange={(e) => { setEditText(e.target.value); setEditError(null); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleEdit(notice.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        rows={2}
                        maxLength={MAX_BODY_LENGTH}
                        autoFocus
                        className="w-full rounded-lg border border-indigo-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
                      />
                      <div className="flex items-center justify-between mt-0.5 px-0.5">
                        {editError
                          ? <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{editError}</span>
                          : <span />
                        }
                        <CharCounter value={editText} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(notice.id)}
                        disabled={!editText.trim()}
                        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white transition-colors"
                        aria-label="保存"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
                        aria-label="キャンセル"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words min-w-0">
                      {notice.body}
                    </p>
                    <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover/item:opacity-100 sm:transition-opacity">
                      <button
                        onClick={() => startEdit(notice)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                        aria-label="編集"
                      >
                        <Pencil size={13} />
                      </button>
                      {confirmDeleteId === notice.id ? (
                        /* Confirm delete — tap again to confirm, auto-cancels after 3s */
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold leading-none touch-manipulation"
                          aria-label="削除を確認"
                        >
                          確認
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors touch-manipulation"
                          aria-label="削除"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
