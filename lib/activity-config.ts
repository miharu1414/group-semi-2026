/**
 * ゼミ活動（扱う書籍・テーマ）の設定ファイル。
 *
 * 新しい活動を追加するには ACTIVITIES 配列に追記して
 * CURRENT_ACTIVITY を切り替えるだけです。
 * コードの変更はこのファイル 1 か所で完結します。
 *
 * ── 将来の拡張について ──
 * 現時点では "その期間にアクティブな活動は 1 つ" という設計です。
 * 複数の活動を並行管理したい場合は:
 *   1. Seminar に activity_id: string フィールドを追加
 *   2. カレンダー・担当一覧で activity_id をもとに設定を切り替える
 * という拡張が最小コストで行えます。
 */

// ── 型定義 ──────────────────────────────────────────────────

export interface RoleConfig {
  /** 担当一覧などで使う短縮ラベル。例: '輪読' */
  short: string;
  /** 概要モーダルに表示する役割説明（箇条書き） */
  description: string[];
  /** Tailwind: カード背景・ボーダー・テキスト */
  cardClass: string;
  /** Tailwind: バッジ背景・テキスト・ボーダー */
  badgeClass: string;
}

export interface TimeFlowStep {
  time: string;
  desc: string;
}

export interface ActivityConfig {
  /** 一意 ID（将来の seminar.activity_id と対応させる想定） */
  id: string;
  /** 活動名 / 書籍タイトル */
  name: string;
  /** サブタイトル（著者名など。省略可） */
  subtitle?: string;
  /** ゼミの目的 */
  purpose: string;
  /** 開催場所（省略可） */
  venue?: string;
  /** 開催スケジュール文言（省略可） */
  scheduleNote?: string;
  /** 参加者の説明（省略可） */
  participantsNote?: string;
  /** ロール A / B / C の定義 */
  roles: {
    a: RoleConfig;
    b: RoleConfig;
    c: RoleConfig;
  };
  /** 予定タイトル入力欄のプレースホルダー */
  titlePlaceholder?: string;
  /** 一日の進行目安 */
  timeFlow: TimeFlowStep[];
  /** 全体メモ（省略可） */
  notes?: string[];
}

// ── 活動リスト ───────────────────────────────────────────────

export const ACTIVITIES: ActivityConfig[] = [
  // ── 現在の活動（〜2026年9月頃） ──
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
  },

  // ── 次の活動はここに追記（例） ──
  // {
  //   id: 'next-activity-id',
  //   name: '次の書籍タイトルやテーマ名',
  //   subtitle: '著者名など',
  //   purpose: '目的の文章',
  //   roles: {
  //     a: { short: 'A役割名', description: ['...'], cardClass: '...', badgeClass: '...' },
  //     b: { short: 'B役割名', description: ['...'], cardClass: '...', badgeClass: '...' },
  //     c: { short: 'C役割名', description: ['...'], cardClass: '...', badgeClass: '...' },
  //   },
  //   timeFlow: [{ time: '60分', desc: '...' }],
  // },
];

/**
 * 現在アクティブな活動設定。
 * 活動を切り替えるときはここを変更する。
 */
export const CURRENT_ACTIVITY: ActivityConfig = ACTIVITIES[0];
