import { db } from '@/lib/firebase-admin';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ref = db.collection('notices').doc(params.id);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ error: 'Not found' }, { status: 404 });

    const body = (await request.json()) as { body: string };
    if (!body.body?.trim()) {
      return Response.json({ error: 'body is required' }, { status: 400 });
    }
    if (body.body.length > 1000) {
      return Response.json({ error: 'body must be 1000 characters or fewer' }, { status: 400 });
    }
    await ref.update({ body: body.body.trim(), updated_at: new Date().toISOString() });
    const updated = await ref.get();
    return Response.json({ id: updated.id, ...updated.data() });
  } catch (e) {
    console.error('PUT /api/notices/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ref = db.collection('notices').doc(params.id);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ error: 'Not found' }, { status: 404 });
    await ref.delete();
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error('DELETE /api/notices/[id] error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
