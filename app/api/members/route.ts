import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  const { env } = getRequestContext() as { env: CloudflareEnv };
  const result = await env.DB.prepare(
    'SELECT * FROM members ORDER BY order_num ASC, created_at ASC'
  ).all();
  return Response.json(result.results);
}

export async function POST(request: Request) {
  const { env } = getRequestContext() as { env: CloudflareEnv };
  const body = (await request.json()) as {
    name: string;
    role?: string;
    order_num?: number;
  };

  if (!body.name?.trim()) {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const maxRow = await env.DB.prepare(
    'SELECT MAX(order_num) as max_order FROM members'
  ).first<{ max_order: number | null }>();
  const orderNum = body.order_num ?? (maxRow?.max_order ?? 0) + 1;

  await env.DB.prepare(
    `INSERT INTO members (id, name, role, order_num, created_at)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(id, body.name.trim(), body.role ?? '', orderNum, now)
    .run();

  const member = await env.DB.prepare('SELECT * FROM members WHERE id = ?')
    .bind(id)
    .first();

  return Response.json(member, { status: 201 });
}
