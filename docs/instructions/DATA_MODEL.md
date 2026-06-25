# Data Model

## Seminar Types

| Code | Label | Color |
| --- | --- | --- |
| `rinudoku` | 輪読ゼミ | Indigo |
| `zentai` | 全体ゼミ | Violet |
| `kenkyu` | 研究共有 | Teal |

When adding or changing a seminar type, update:

1. `lib/types.ts`
2. UI labels/colors that reference `SEMINAR_TYPES`
3. Documentation that explains seminar types

## Assignment Roles

| Field | Meaning |
| --- | --- |
| `assignee_a` | 発表・進行担当 |
| `assignee_b` | 記録・議事録担当 |
| `assignee_c` | 資料・補助担当 |

All assignment fields are optional strings. Use `''` rather than `null`.

## Firestore Collections

### `seminars`

| Field | Type | Notes |
| --- | --- | --- |
| `date` | string | `YYYY-MM-DD` |
| `type` | string | `rinudoku` / `zentai` / `kenkyu` |
| `title` | string | optional text |
| `assignee_a` | string | optional |
| `assignee_b` | string | optional |
| `assignee_c` | string | optional |
| `notes` | string | optional |
| `created_at` | string | ISO timestamp |
| `updated_at` | string | ISO timestamp |

The document ID is returned as `id` in API responses.

### `members`

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | required |
| `role` | string | grade/role label |
| `order_num` | number | display order |
| `created_at` | string | ISO timestamp |

The document ID is returned as `id` in API responses.

## TypeScript

The shared application types live in `lib/types.ts`.
