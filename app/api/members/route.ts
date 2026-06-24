import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { Member } from '@/lib/types';

export const runtime = 'edge';

export async function GET(): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const result = await env.DB.prepare('SELECT * FROM members ORDER BY order_num ASC, name ASC').all<Member>();
    return NextResponse.json(result.results);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const body = await request.json() as Partial<Member>;

    if (!body.name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const countResult = await env.DB.prepare('SELECT COUNT(*) as cnt FROM members').first<{ cnt: number }>();
    const order_num = body.order_num ?? (countResult?.cnt ?? 0) + 1;

    await env.DB.prepare(
      'INSERT INTO members (id, name, role, order_num) VALUES (?, ?, ?, ?)'
    )
      .bind(id, body.name, body.role ?? '', order_num)
      .run();

    const member = await env.DB.prepare('SELECT * FROM members WHERE id = ?').bind(id).first<Member>();
    return NextResponse.json(member, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
