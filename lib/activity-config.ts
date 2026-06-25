/**
 * ゼミ活動（扱う書籍・テーマ）の設定ファイル。
 *
 * 新しい活動を追加するには ACTIVITIES 配列に追記して
 * CURRENT_ACTIVITY を切り替えるだけです。
 * コードの変更はこのファイル 1 か所で完結します。
 *
 * ── 将来の拡張について ──
 * seminar.activity_id に活動 ID を設定することで、
 * 同じカレンダー上に複数の活動を色分けして表示できます。
 * activity_id 未設定の予定は SEMINAR_TYPES のデフォルト色を使います。
 */

import { SEMINAR_TYPES, SeminarTypeConfig } from './types';
import type { Seminar } from './types';

// ── 型定義 ──────────────────────────────────────────────────

export interface RoleConfig {
  short: string;
  description: string[];
  cardClass: string;
  badgeClass: string;
}

export interface TimeFlowStep {
  time: string;
  desc: string;
}

export interface ActivityConfig {
  id: string;
  name: string;
  subtitle?: string;
  purpose: string;
  venue?: string;
  scheduleNote?: string;
  participantsNote?: string;
  roles: {
    a: RoleConfig;
    b: RoleConfig;
    c: RoleConfig;
  };
  titlePlaceholder?: string;
  timeFlow: TimeFlowStep[];
  notes?: string[];
  /** 予定カードの色スキーム。設定時、type ベースのデフォルト色を上書きする */
  colorScheme?: SeminarTypeConfig;
}

// ── 活動リスト ───────────────────────────────────────────────

export const ACTIVITIES: ActivityConfig[] = [
  // ── 現在の活動（〜2026年9月頃）: 独学で鍛える数理思考２ ──
  {
    id: 'math-thinking-2',
    name: '独学で鍛える数理思考２',
    subtitle: '古嶋十潤 著',
    purpose:
      '蓮池研究メンバーの研究に対して、自分なりのコメント・意見・疑問・示唆を持てるようになること',
    venue: 'ゼミ室 14-02',
    scheduleNote: '毎週水曜日 3・4限（2週間で1章程度が目安）',
    participantsNote: 'M2: 並木 / M1: 近藤 / B4: 有田・篠塚（院試後から参加）',
    roles: {
      a: {
        short: '輪読',
        description: [
          '輪読本の内容説明を担当',
          'メモや板書を使いながら進行',
          '数式なども追う',
        ],
        cardClass: 'bg-indigo-50 border-indigo-200 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      },
      b: {
        short: '関連研究',
        description: [
          '関連研究・活用事例の紹介',
          'A・C 担当以外の残りのメンバー全員',
          'スライド／メモ／リンク／論文本体など何らかの資料を用意',
        ],
        cardClass: 'bg-violet-50 border-violet-200 text-violet-900',
        badgeClass: 'bg-violet-100 text-violet-700 border-violet-200',
      },
      c: {
        short: 'コラム',
        description: [
          'コラム・基礎復習・周辺知識を紹介',
          'スライド／PDF／ドキュメントのいずれかを用意',
        ],
        cardClass: 'bg-teal-50 border-teal-200 text-teal-900',
        badgeClass: 'bg-teal-100 text-teal-700 border-teal-200',
      },
    },
    titlePlaceholder: '例: 第3章まとめ、1日目',
    timeFlow: [
      { time: '15分',     desc: 'ファイナンスの復習' },
      { time: '60分',     desc: 'A 輪読（内容説明）' },
      { time: '15〜30分', desc: 'C コラム・周辺知識' },
      { time: '各15分',   desc: 'B 関連研究・活用事例' },
    ],
    notes: [
      '本の内容確認だけでなく、関連研究や事例に広げて深めることも大切',
      '10/7以降も毎週水曜日を基本として継続予定',
    ],
    // colorScheme 未設定 → SEMINAR_TYPES.rinudoku (indigo) をそのまま使用
  },

  // ── 次期活動（2026年10月〜: 書籍・テーマ未定）──
  {
    id: 'reading-oct-2026',
    name: '輪読ゼミ（10月〜）',
    subtitle: '書籍・テーマ未定',
    purpose: '（内容確定次第更新予定）',
    venue: 'ゼミ室 14-02',
    scheduleNote: '毎週水曜日 3・4限',
    roles: {
      a: {
        short: '輪読',
        description: ['輪読担当'],
        cardClass: 'bg-sky-50 border-sky-200 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
      },
      b: {
        short: '関連研究',
        description: ['関連研究・活用事例の紹介'],
        cardClass: 'bg-sky-50 border-sky-200 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
      },
      c: {
        short: 'コラム',
        description: ['コラム・周辺知識の紹介'],
        cardClass: 'bg-sky-50 border-sky-200 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
      },
    },
    titlePlaceholder: '例: タイトル・章番号など',
    timeFlow: [],
    notes: ['10月以降の輪読ゼミ。書籍・テーマは追って決定予定。'],
    colorScheme: {
      label: '輪読ゼミ',
      shortLabel: '輪読',
      bgClass: 'bg-sky-100',
      textClass: 'text-sky-800',
      borderClass: 'border-sky-200',
      dotClass: 'bg-sky-500',
      hoverClass: 'hover:bg-sky-200',
    },
  },

  // ── さらに次の活動はここに追記 ──
  // {
  //   id: 'next-activity-id',
  //   name: '次の書籍タイトルやテーマ名',
  //   ...
  //   colorScheme: { bgClass: '...', textClass: '...', ... },
  // },
];

/** 現在アクティブな活動設定（概要モーダルに表示される） */
export const CURRENT_ACTIVITY: ActivityConfig = ACTIVITIES[0];

/**
 * seminar.activity_id に対応する色設定を返す。
 * activity_id 未設定 or 不明の場合は SEMINAR_TYPES のデフォルト色を使用。
 */
export function getEventConfig(
  seminar: Pick<Seminar, 'type' | 'activity_id'>
): SeminarTypeConfig {
  if (seminar.activity_id) {
    const activity = ACTIVITIES.find((a) => a.id === seminar.activity_id);
    if (activity?.colorScheme) return activity.colorScheme;
  }
  return SEMINAR_TYPES[seminar.type];
}
