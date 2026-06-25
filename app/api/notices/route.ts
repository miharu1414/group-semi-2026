import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('notices').orderBy('created_at', 'asc').get();
    const notices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return Response.json(notices);
  } catch (e) {
    console.error('GET /api/notices error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { body: string };
    if (!body.body?.trim()) {
      return Response.json({ error: 'body is required' }, { status: 400 });
    }
    const now = new Date().toISOString();
    const data = {
      body: body.body.trim(),
      created_at: now,
      updated_at: now,
    };
    const ref = await db.collection('notices').add(data);
    return Response.json({ id: ref.id, ...data }, { status: 201 });
  } catch (e) {
    console.error('POST /api/notices error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
