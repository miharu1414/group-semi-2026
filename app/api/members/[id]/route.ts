import { db } from '@/lib/firebase-admin';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.collection('members').doc(params.id).get();
    if (!doc.exists) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ id: doc.id, ...doc.data() });
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
    const ref = db.collection('members').doc(params.id);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ error: 'Not found' }, { status: 404 });

    const body = (await request.json()) as {
      name?: string;
      role?: string;
      order_num?: number;
    };

    await ref.update(body as Record<string, unknown>);
    const updated = await ref.get();
    return Response.json({ id: updated.id, ...updated.data() });
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
    const ref = db.collection('members').doc(params.id);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ error: 'Not found' }, { status: 404 });

    await ref.delete();
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error('DELETE /api/members/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
