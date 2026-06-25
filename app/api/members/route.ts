import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('members').orderBy('order_num', 'asc').get();
    const members = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(members);
  } catch (e) {
    console.error('GET /api/members error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name: string;
      role?: string;
      order_num?: number;
    };

    if (!body.name?.trim()) {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }
    if (body.order_num !== undefined && (!Number.isFinite(body.order_num) || body.order_num < 0)) {
      return Response.json({ error: 'order_num must be a non-negative number' }, { status: 400 });
    }

    const snapshot = await db.collection('members').orderBy('order_num', 'desc').limit(1).get();
    const maxOrder = snapshot.empty ? 0 : (snapshot.docs[0].data().order_num as number) ?? 0;
    const orderNum = body.order_num ?? maxOrder + 1;

    const data = {
      name: body.name.trim(),
      role: body.role?.trim() ?? '',
      order_num: orderNum,
      created_at: new Date().toISOString(),
    };

    const ref = await db.collection('members').add(data);
    return Response.json({ id: ref.id, ...data }, { status: 201 });
  } catch (e) {
    console.error('POST /api/members error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
