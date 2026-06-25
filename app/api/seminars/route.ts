import { db } from '@/lib/firebase-admin';
import { normalizeAssigneeList, normalizeSeminarRecord, normalizeText } from '@/lib/seminar-normalize';

const VALID_SEMINAR_TYPES = ['rinudoku', 'zentai', 'kenkyu', 'other'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidSeminarType(type: unknown): type is typeof VALID_SEMINAR_TYPES[number] {
  return typeof type === 'string' && VALID_SEMINAR_TYPES.includes(type as typeof VALID_SEMINAR_TYPES[number]);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // yyyy-MM

    const snapshot = await db.collection('seminars').orderBy('date', 'asc').get();
    const seminars = snapshot.docs.map((doc) => normalizeSeminarRecord(doc.id, doc.data()));

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

    const date = normalizeText(body.date);
    const startTime = normalizeText(body.start_time);
    const endTime = normalizeText(body.end_time);

    if (!DATE_RE.test(date)) {
      return Response.json({ error: 'valid date (YYYY-MM-DD) is required' }, { status: 400 });
    }
    if (!isValidSeminarType(body.type)) {
      return Response.json({ error: `type must be one of: ${VALID_SEMINAR_TYPES.join(', ')}` }, { status: 400 });
    }
    if (startTime && !TIME_RE.test(startTime)) {
      return Response.json({ error: 'start_time must be HH:MM' }, { status: 400 });
    }
    if (endTime && !TIME_RE.test(endTime)) {
      return Response.json({ error: 'end_time must be HH:MM' }, { status: 400 });
    }
    if (startTime && endTime && startTime > endTime) {
      return Response.json({ error: 'end_time must be after start_time' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const data = {
      date,
      type: body.type,
      title: normalizeText(body.title),
      custom_label: normalizeText(body.custom_label),
      activity_id: normalizeText(body.activity_id),
      start_time: startTime,
      end_time: endTime,
      assignee_a: normalizeText(body.assignee_a),
      assignee_b: normalizeAssigneeList(body.assignee_b),
      assignee_c: normalizeText(body.assignee_c),
      notes: normalizeText(body.notes),
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
