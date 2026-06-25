import { db } from '@/lib/firebase-admin';
import { normalizeAssigneeB } from '@/lib/types';

const VALID_SEMINAR_TYPES = ['rinudoku', 'zentai', 'kenkyu', 'other'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

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
        activity_id: (data.activity_id as string) ?? '',
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
      activity_id?: string;
      start_time?: string;
      end_time?: string;
      assignee_a?: string;
      assignee_b?: string[];
      assignee_c?: string;
      notes?: string;
    };

    if (!body.date || !DATE_RE.test(body.date)) {
      return Response.json({ error: 'valid date (YYYY-MM-DD) is required' }, { status: 400 });
    }
    if (!body.type || !VALID_SEMINAR_TYPES.includes(body.type as typeof VALID_SEMINAR_TYPES[number])) {
      return Response.json({ error: `type must be one of: ${VALID_SEMINAR_TYPES.join(', ')}` }, { status: 400 });
    }
    if (body.start_time && !TIME_RE.test(body.start_time)) {
      return Response.json({ error: 'start_time must be HH:MM' }, { status: 400 });
    }
    if (body.end_time && !TIME_RE.test(body.end_time)) {
      return Response.json({ error: 'end_time must be HH:MM' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const data = {
      date: body.date,
      type: body.type,
      title: body.title ?? '',
      custom_label: body.custom_label ?? '',
      activity_id: body.activity_id ?? '',
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
