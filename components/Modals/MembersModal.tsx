'use client';

import { useState } from 'react';
import { X, Plus, Trash2, GripVertical, Pencil, Check } from 'lucide-react';
import { Member, MemberFormData } from '@/lib/types';
import { createMember, updateMember, deleteMember } from '@/lib/api';

interface Props {
  open: boolean;
  members: Member[];
  onClose: () => void;
  onChange: (members: Member[]) => void;
}

const ROLES = ['M2', 'M1', 'B4', 'B3', 'D3', 'D2', 'D1', '教員', 'その他'];

export default function MembersModal({ open, members, onClose, onChange }: Props) {
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MemberFormData>({ name: '', role: '', order_num: 0 });

  if (!open) return null;

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const created = await createMember({ name: newName.trim(), role: newRole, order_num: members.length + 1 });
      onChange([...members, created]);
      setNewName('');
      setNewRole('');
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleEditStart = (member: Member) => {
    setEditingId(member.id);
    setEditForm({ name: member.name, role: member.role, order_num: member.order_num });
  };

  const handleEditSave = async (id: string) => {
    try {
      const updated = await updateMember(id, editForm);
      onChange(members.map((m) => (m.id === id ? updated : m)));
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id);
      onChange(members.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 modal-backdrop z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-white shadow-2xl z-50 flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-base font-semibold text-gray-900">メンバー管理</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Member List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {members.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm">メンバーがいません</p>
              <p className="text-xs mt-1">下からメンバーを追加してください</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 group"
                >
                  <GripVertical size={14} className="text-gray-300 shrink-0" />

                  {editingId === member.id ? (
                    <>
                      <div className="flex-1 flex gap-2 min-w-0">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          className="flex-1 min-w-0 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                          className="w-20 rounded-lg border border-gray-300 px-1 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                          <option value="">学年</option>
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleEditSave(member.id)}
                        className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0"
                      >
                        <Check size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-800 block truncate">{member.name}</span>
                        {member.role && (
                          <span className="text-xs text-gray-400">{member.role}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleEditStart(member)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        title="編集"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        title="削除"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Member Form */}
        <div className="border-t border-gray-200 px-5 py-4 shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            新しいメンバーを追加
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="名前"
              className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-300"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">学年</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors shrink-0"
            >
              <Plus size={15} />
              追加
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
