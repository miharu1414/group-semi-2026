import { db } from '@/lib/firebase-admin';
import { normalizeAssigneeB } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // yyyy-MM

    const snapshot = await db.collection('seminars').orderBy('date', 'asc').get();
    type SeminarDoc = { id: string; date: string; assignee_b: string[]; [key: string]: unknown };
    const seminars = snapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>;
      return {
        id: doc.id,
        ...data,
        assignee_b: normalizeAssigneeB(data.assignee_b),
        custom_label: (data.custom_label as string) ?? '',
        start_time: (data.start_time as string) ?? '',
        end_time: (data.end_time as string) ?? '',
      } as unknown as SeminarDoc;
    });

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
      custom_label?: string;
      start_time?: string;
      end_time?: string;
      assignee_a?: string;
      assignee_b?: string[];
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
      custom_label: body.custom_label ?? '',
      start_time: body.start_time ?? '',
      end_time: body.end_time ?? '',
      assignee_a: body.assignee_a ?? '',
      assignee_b: body.assignee_b ?? [],
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
