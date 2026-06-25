'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Notice } from '@/lib/types';
import { getNotices, createNotice, updateNotice, deleteNotice } from '@/lib/api';

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // 新規追加
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);
  const newRef = useRef<HTMLTextAreaElement>(null);

  // 編集中の ID
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    getNotices()
      .then(setNotices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (adding) newRef.current?.focus();
  }, [adding]);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    try {
      const created = await createNotice(newText.trim());
      setNotices((prev) => [...prev, created]);
      setNewText('');
      setAdding(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;
    try {
      const updated = await updateNotice(id, editText.trim());
      setNotices((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setEditText(notice.body);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <section className="border-t border-slate-200/80 bg-slate-50/60 backdrop-blur-md shrink-0 max-h-[28vh] flex flex-col">
      {/* Fixed header */}
      <div className="px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-slate-700">
          メモ・連絡事項
        </h2>
        <button
          onClick={() => { setAdding(true); setEditingId(null); }}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/60 active:bg-indigo-100/60 px-2 py-2 sm:py-1 rounded-lg transition-colors touch-manipulation"
        >
          <Plus size={13} />
          追加
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-3">
        {/* New entry */}
        {adding && (
          <div className="mb-3 flex gap-2 items-start">
            <textarea
              ref={newRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd();
                if (e.key === 'Escape') { setAdding(false); setNewText(''); }
              }}
              rows={2}
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
                onClick={() => { setAdding(false); setNewText(''); }}
                className="p-2 rounded-lg hover:bg-slate-200/60 text-slate-500 transition-colors"
                aria-label="キャンセル"
              >
                <X size={14} />
              </button>
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
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleEdit(notice.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      rows={2}
                      autoFocus
                      className="flex-1 rounded-lg border border-indigo-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
                    />
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
                    <p className="flex-1 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
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
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors touch-manipulation"
                        aria-label="削除"
                      >
                        <Trash2 size={13} />
                      </button>
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
