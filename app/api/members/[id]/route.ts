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

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) {
      const name = body.name.trim();
      if (!name) {
        return Response.json({ error: 'name cannot be empty' }, { status: 400 });
      }
      updates.name = name;
    }
    if (body.role !== undefined) {
      updates.role = body.role.trim();
    }
    if (body.order_num !== undefined) {
      if (!Number.isFinite(body.order_num) || body.order_num < 0) {
        return Response.json({ error: 'order_num must be a non-negative number' }, { status: 400 });
      }
      updates.order_num = body.order_num;
    }
    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'no valid fields to update' }, { status: 400 });
    }

    await ref.update(updates);
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
