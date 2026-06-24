import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // yyyy-MM

    const snapshot = await db.collection('seminars').orderBy('date', 'asc').get();
    const seminars = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as { id: string; date: string; [key: string]: unknown }));

    return Response.json(
      month ? seminars.filter((s) => s.date.startsWith(month)) : seminars
    );
  } catch (e) {
    console.error('GET /api/seminars error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const now = new Date().toISOString();
    const data = {
      date: body.date,
      type: body.type,
      title: body.title ?? '',
      assignee_a: body.assignee_a ?? '',
      assignee_b: body.assignee_b ?? '',
      assignee_c: body.assignee_c ?? '',
      notes: body.notes ?? '',
      created_at: now,
      updated_at: now,
    };

    const ref = await db.collection('seminars').add(data);
    return Response.json({ id: ref.id, ...data }, { status: 201 });
  } catch (e) {
    console.error('POST /api/seminars error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
