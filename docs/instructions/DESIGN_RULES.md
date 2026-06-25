# Design Rules

## Principles

- Prioritize dense, scannable calendar information.
- Keep the interface quiet and operational rather than decorative.
- Make mobile workflows usable on narrow screens.
- Use clear focus states and accessible labels for interactive controls.

## Seminar Colors

Seminar colors are defined in `lib/types.ts` as `SEMINAR_TYPES`.

| Type | Base Color |
| --- | --- |
| 輪読ゼミ | Indigo |
| 全体ゼミ | Violet |
| 研究共有会 | Teal |

## Layout

- Calendar cells should keep stable dimensions.
- Modal widths should be constrained and responsive.
- Buttons and form controls should not shift layout on hover or loading states.

## Accessibility

- Interactive icon buttons need `aria-label` or `title`.
- Modals should use `role="dialog"` and `aria-modal="true"`.
- Form fields need visible labels.
- Do not rely on color alone to convey seminar type.
