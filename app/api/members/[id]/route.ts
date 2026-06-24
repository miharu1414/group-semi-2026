import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { Member } from '@/lib/types';

export const runtime = 'edge';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const body = await request.json() as Partial<Member>;

    const existing = await env.DB.prepare('SELECT * FROM members WHERE id = ?')
      .bind(params.id)
      .first<Member>();

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await env.DB.prepare(
      'UPDATE members SET name = ?, role = ?, order_num = ? WHERE id = ?'
    )
      .bind(
        body.name ?? existing.name,
        body.role ?? existing.role,
        body.order_num ?? existing.order_num,
        params.id
      )
      .run();

    const updated = await env.DB.prepare('SELECT * FROM members WHERE id = ?')
      .bind(params.id)
      .first<Member>();

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
    const existing = await env.DB.prepare('SELECT id FROM members WHERE id = ?')
      .bind(params.id)
      .first();

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await env.DB.prepare('DELETE FROM members WHERE id = ?').bind(params.id).run();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
