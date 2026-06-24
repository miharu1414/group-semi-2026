import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { Seminar } from '@/lib/types';

export const runtime = 'edge';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const seminar = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?')
      .bind(params.id)
      .first<Seminar>();

    if (!seminar) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(seminar);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const body = await request.json() as Partial<Seminar>;

    const existing = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?')
      .bind(params.id)
      .first<Seminar>();

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await env.DB.prepare(
      `UPDATE seminars
       SET date = ?, type = ?, title = ?, assignee_a = ?, assignee_b = ?, assignee_c = ?, notes = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
      .bind(
        body.date ?? existing.date,
        body.type ?? existing.type,
        body.title ?? existing.title,
        body.assignee_a ?? existing.assignee_a,
        body.assignee_b ?? existing.assignee_b,
        body.assignee_c ?? existing.assignee_c,
        body.notes ?? existing.notes,
        params.id
      )
      .run();

    const updated = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?')
      .bind(params.id)
      .first<Seminar>();

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const existing = await env.DB.prepare('SELECT id FROM seminars WHERE id = ?')
      .bind(params.id)
      .first();

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await env.DB.prepare('DELETE FROM seminars WHERE id = ?').bind(params.id).run();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
