import { db } from '@/lib/firebase-admin';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.collection('seminars').doc(params.id).get();
    if (!doc.exists) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ id: doc.id, ...doc.data() });
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
    const ref = db.collection('seminars').doc(params.id);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ error: 'Not found' }, { status: 404 });

    const body = (await request.json()) as {
      date?: string;
      type?: string;
      title?: string;
      assignee_a?: string;
      assignee_b?: string;
      assignee_c?: string;
      notes?: string;
    };

    const updates = { ...body, updated_at: new Date().toISOString() };
    await ref.update(updates);

    const updated = await ref.get();
    return Response.json({ id: updated.id, ...updated.data() });
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
    const ref = db.collection('seminars').doc(params.id);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ error: 'Not found' }, { status: 404 });

    await ref.delete();
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error('DELETE /api/seminars/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
