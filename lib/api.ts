import { Seminar, SeminarFormData, Member, MemberFormData, Notice } from './types';

const BASE = '/api';

// ───── Seminars ─────

export async function getSeminars(month?: string): Promise<Seminar[]> {
  const url = month ? `${BASE}/seminars?month=${month}` : `${BASE}/seminars`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch seminars');
  return res.json();
}

export async function createSeminar(data: SeminarFormData): Promise<Seminar> {
  const res = await fetch(`${BASE}/seminars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create seminar');
  return res.json();
}

export async function updateSeminar(id: string, data: SeminarFormData): Promise<Seminar> {
  const res = await fetch(`${BASE}/seminars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update seminar');
  return res.json();
}

export async function deleteSeminar(id: string): Promise<void> {
  const res = await fetch(`${BASE}/seminars/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete seminar');
}

// ───── Members ─────

export async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${BASE}/members`);
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}

export async function createMember(data: MemberFormData): Promise<Member> {
  const res = await fetch(`${BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create member');
  return res.json();
}

export async function updateMember(id: string, data: MemberFormData): Promise<Member> {
  const res = await fetch(`${BASE}/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update member');
  return res.json();
}

export async function deleteMember(id: string): Promise<void> {
  const res = await fetch(`${BASE}/members/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete member');
}

// ───── Notices ─────

export async function getNotices(): Promise<Notice[]> {
  const res = await fetch(`${BASE}/notices`);
  if (!res.ok) throw new Error('Failed to fetch notices');
  return res.json();
}

export async function createNotice(body: string): Promise<Notice> {
  const res = await fetch(`${BASE}/notices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error('Failed to create notice');
  return res.json();
}

export async function updateNotice(id: string, body: string): Promise<Notice> {
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error('Failed to update notice');
  return res.json();
}

export async function deleteNotice(id: string): Promise<void> {
  const res = await fetch(`${BASE}/notices/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete notice');
}
