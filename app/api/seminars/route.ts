import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { Seminar } from '@/lib/types';

export const runtime = 'edge';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // e.g. "2026-07"

    const stmt = month
      ? env.DB.prepare('SELECT * FROM seminars WHERE date LIKE ? ORDER BY date ASC').bind(`${month}%`)
      : env.DB.prepare('SELECT * FROM seminars ORDER BY date ASC');

    const result = await stmt.all<Seminar>();
    return NextResponse.json(result.results);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const body = await request.json() as Partial<Seminar>;

    if (!body.date || !body.type) {
      return NextResponse.json({ error: 'date and type are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      `INSERT INTO seminars (id, date, type, title, assignee_a, assignee_b, assignee_c, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        body.date,
        body.type,
        body.title ?? '',
        body.assignee_a ?? '',
        body.assignee_b ?? '',
        body.assignee_c ?? '',
        body.notes ?? ''
      )
      .run();

    const seminar = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?').bind(id).first<Seminar>();
    return NextResponse.json(seminar, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
