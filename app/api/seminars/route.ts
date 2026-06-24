import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    const result = month
      ? await env.DB.prepare(
          'SELECT * FROM seminars WHERE date LIKE ? ORDER BY date ASC'
        )
          .bind(`${month}-%`)
          .all()
      : await env.DB.prepare('SELECT * FROM seminars ORDER BY date ASC').all();

    return Response.json(result.results);
  } catch (e) {
    console.error('GET /api/seminars error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const body = (await request.json()) as {
      date: string;
      type: string;
      title?: string;
      assignee_a?: string;
      assignee_b?: string;
      assignee_c?: string;
      notes?: string;
    };

    if (!body.date || !body.type) {
      return Response.json({ error: 'date and type are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO seminars (id, date, type, title, assignee_a, assignee_b, assignee_c, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        body.date,
        body.type,
        body.title ?? '',
        body.assignee_a ?? '',
        body.assignee_b ?? '',
        body.assignee_c ?? '',
        body.notes ?? '',
        now,
        now
      )
      .run();

    const seminar = await env.DB.prepare('SELECT * FROM seminars WHERE id = ?')
      .bind(id)
      .first();

    return Response.json(seminar, { status: 201 });
  } catch (e) {
    console.error('POST /api/seminars error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
