import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const seminar = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?')
      .bind(params.id)
      .first();

    if (!seminar) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(seminar);
  } catch (e) {
    console.error('GET /api/seminars/[id] error:', e);
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
      date?: string;
      type?: string;
      title?: string;
      assignee_a?: string;
      assignee_b?: string;
      assignee_c?: string;
      notes?: string;
    };

    const existing = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?')
      .bind(params.id)
      .first();
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

    const now = new Date().toISOString();

    await env.DB.prepare(
      `UPDATE seminars
       SET date = ?, type = ?, title = ?, assignee_a = ?, assignee_b = ?, assignee_c = ?, notes = ?, updated_at = ?
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
        now,
        params.id
      )
      .run();

    const updated = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?')
      .bind(params.id)
      .first();

    return Response.json(updated);
  } catch (e) {
    console.error('PUT /api/seminars/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const existing = await env.DB.prepare('SELECT id FROM seminars WHERE id = ?')
      .bind(params.id)
      .first();
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

    await env.DB.prepare('DELETE FROM seminars WHERE id = ?').bind(params.id).run();
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error('DELETE /api/seminars/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
