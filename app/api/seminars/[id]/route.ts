import { db } from '@/lib/firebase-admin';
import { normalizeAssigneeList, normalizeSeminarRecord, normalizeText } from '@/lib/seminar-normalize';

const VALID_SEMINAR_TYPES = ['rinudoku', 'zentai', 'kenkyu', 'other'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidSeminarType(type: unknown): type is typeof VALID_SEMINAR_TYPES[number] {
  return typeof type === 'string' && VALID_SEMINAR_TYPES.includes(type as typeof VALID_SEMINAR_TYPES[number]);
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.collection('seminars').doc(params.id).get();
    if (!doc.exists) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(normalizeSeminarRecord(doc.id, doc.data()!));
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
      custom_label?: string;
      activity_id?: string;
      start_time?: string;
      end_time?: string;
      assignee_a?: string;
      assignee_b?: string[];
      assignee_c?: string;
      notes?: string;
    };

    if (body.date !== undefined && !DATE_RE.test(normalizeText(body.date))) {
      return Response.json({ error: 'valid date (YYYY-MM-DD) is required' }, { status: 400 });
    }
    if (body.type !== undefined && !isValidSeminarType(body.type)) {
      return Response.json({ error: `type must be one of: ${VALID_SEMINAR_TYPES.join(', ')}` }, { status: 400 });
    }
    const startTime = body.start_time !== undefined ? normalizeText(body.start_time) : undefined;
    const endTime = body.end_time !== undefined ? normalizeText(body.end_time) : undefined;

    if (startTime && !TIME_RE.test(startTime)) {
      return Response.json({ error: 'start_time must be HH:MM' }, { status: 400 });
    }
    if (endTime && !TIME_RE.test(endTime)) {
      return Response.json({ error: 'end_time must be HH:MM' }, { status: 400 });
    }
    if (startTime && endTime && startTime > endTime) {
      return Response.json({ error: 'end_time must be after start_time' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.date         !== undefined) updates.date         = normalizeText(body.date);
    if (body.type         !== undefined) updates.type         = body.type;
    if (body.title        !== undefined) updates.title        = normalizeText(body.title);
    if (body.custom_label !== undefined) updates.custom_label = normalizeText(body.custom_label);
    if (body.activity_id  !== undefined) updates.activity_id  = normalizeText(body.activity_id);
    if (body.start_time   !== undefined) updates.start_time   = startTime ?? '';
    if (body.end_time     !== undefined) updates.end_time     = endTime ?? '';
    if (body.assignee_a   !== undefined) updates.assignee_a   = normalizeText(body.assignee_a);
    if (body.assignee_b   !== undefined) updates.assignee_b   = normalizeAssigneeList(body.assignee_b);
    if (body.assignee_c   !== undefined) updates.assignee_c   = normalizeText(body.assignee_c);
    if (body.notes        !== undefined) updates.notes        = normalizeText(body.notes);
    await ref.update(updates);

    const updated = await ref.get();
    return Response.json(normalizeSeminarRecord(updated.id, updated.data()!));
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
