import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const member = await env.DB.prepare('SELECT * FROM members WHERE id = ?')
      .bind(params.id)
      .first();
    if (!member) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(member);
  } catch (e) {
    console.error('GET /api/members/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const body = (await request.json()) as {
      name?: string;
      role?: string;
      order_num?: number;
    };

    const existing = await env.DB.prepare('SELECT * FROM members WHERE id = ?')
      .bind(params.id)
      .first();
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

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
      .first();

    return Response.json(updated);
  } catch (e) {
    console.error('PUT /api/members/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const existing = await env.DB.prepare('SELECT id FROM members WHERE id = ?')
      .bind(params.id)
      .first();
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

    await env.DB.prepare('DELETE FROM members WHERE id = ?').bind(params.id).run();
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error('DELETE /api/members/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
