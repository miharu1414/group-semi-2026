import { db } from '@/lib/firebase-admin';
import { normalizeAssigneeB } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.collection('seminars').doc(params.id).get();
    if (!doc.exists) return Response.json({ error: 'Not found' }, { status: 404 });
    const data = doc.data()!;
    return Response.json({ id: doc.id, ...data, assignee_b: normalizeAssigneeB(data.assignee_b) });
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
      assignee_b?: string[];
      assignee_c?: string;
      notes?: string;
    };

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.date      !== undefined) updates.date       = body.date;
    if (body.type      !== undefined) updates.type       = body.type;
    if (body.title     !== undefined) updates.title      = body.title;
    if (body.assignee_a !== undefined) updates.assignee_a = body.assignee_a;
    if (body.assignee_b !== undefined) updates.assignee_b = body.assignee_b;
    if (body.assignee_c !== undefined) updates.assignee_c = body.assignee_c;
    if (body.notes     !== undefined) updates.notes      = body.notes;
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
