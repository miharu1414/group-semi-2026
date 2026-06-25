/**
 * 輪読ゼミスケジュール（2026年7〜9月）の初期データ投入スクリプト
 * 実行: node scripts/seed-seminars.mjs
 * ※ dev server が localhost:3000 で起動中であること
 */

const BASE = 'http://localhost:3000/api';

const SEMINARS = [
  // ── 7月 ──
  {
    date: '2026-07-01', type: 'rinudoku', title: '第1章',
    assignee_a: '並木', assignee_b: ['近藤', '篠塚'], assignee_c: '有田',
    notes: '全体ゼミ後 / C: 巻末付録A',
  },
  {
    date: '2026-07-08', type: 'rinudoku', title: '第1章',
    assignee_a: '有田', assignee_b: ['並木', '篠塚'], assignee_c: '近藤',
    notes: 'C: 巻末付録C',
  },
  {
    date: '2026-07-15', type: 'rinudoku', title: '第2章',
    assignee_a: '並木', assignee_b: ['近藤', '有田'], assignee_c: '篠塚',
    notes: '+研究共有会 / C: 自由',
  },
  {
    date: '2026-07-15', type: 'kenkyu', title: '研究共有会',
    assignee_a: '', assignee_b: [], assignee_c: '',
    notes: '輪読ゼミと同日開催',
  },
  {
    date: '2026-07-22', type: 'rinudoku', title: '第2章',
    assignee_a: '近藤', assignee_b: ['有田', '篠塚'], assignee_c: '並木',
    notes: 'C: 巻末付録B',
  },
  // ── 8月 ──
  {
    date: '2026-08-05', type: 'rinudoku', title: '第3章',
    assignee_a: '篠塚', assignee_b: ['並木', '近藤'], assignee_c: '有田',
    notes: 'C: 自由',
  },
  {
    date: '2026-08-19', type: 'rinudoku', title: '第3章',
    assignee_a: '有田', assignee_b: ['並木', '近藤'], assignee_c: '篠塚',
    notes: 'C: 巻末付録D',
  },
  {
    date: '2026-08-26', type: 'rinudoku', title: '第4章',
    assignee_a: '篠塚', assignee_b: ['近藤', '有田'], assignee_c: '並木',
    notes: 'C: 自由',
  },
  // 夏合宿
  {
    date: '2026-08-27', type: 'other', title: '1日目', custom_label: '夏合宿',
    assignee_a: '', assignee_b: [], assignee_c: '',
    notes: '',
  },
  {
    date: '2026-08-28', type: 'other', title: '2日目', custom_label: '夏合宿',
    assignee_a: '', assignee_b: [], assignee_c: '',
    notes: '',
  },
  {
    date: '2026-08-29', type: 'other', title: '3日目', custom_label: '夏合宿',
    assignee_a: '', assignee_b: [], assignee_c: '',
    notes: '',
  },
  // ── 9月 ──
  {
    date: '2026-09-02', type: 'rinudoku', title: '第4章',
    assignee_a: '並木', assignee_b: ['近藤', '篠塚'], assignee_c: '有田',
    notes: 'C: 巻末付録E',
  },
  {
    date: '2026-09-09', type: 'rinudoku', title: '第5章',
    assignee_a: '有田', assignee_b: ['並木', '篠塚'], assignee_c: '近藤',
    notes: 'C: 自由',
  },
  {
    date: '2026-09-16', type: 'rinudoku', title: '第5章',
    assignee_a: '近藤', assignee_b: ['並木', '有田'], assignee_c: '篠塚',
    notes: 'C: 自由',
  },
  {
    date: '2026-09-23', type: 'rinudoku', title: '第6章',
    assignee_a: '篠塚', assignee_b: ['並木', '有田'], assignee_c: '近藤',
    notes: 'C: 自由',
  },
  {
    date: '2026-09-30', type: 'rinudoku', title: '第6章',
    assignee_a: '近藤', assignee_b: ['有田', '篠塚'], assignee_c: '並木',
    notes: 'C: 自由',
  },
];

async function main() {
  // 既存データ取得（重複回避）
  const existing = await fetch(`${BASE}/seminars`).then(r => r.json());
  const existingKeys = new Set(
    existing.map(s => `${s.date}__${s.type}__${s.title}`)
  );

  let added = 0;
  for (const sem of SEMINARS) {
    const key = `${sem.date}__${sem.type}__${sem.title}`;
    if (existingKeys.has(key)) {
      console.log(`SKIP: ${sem.date} ${sem.title} (${sem.type})`);
      continue;
    }
    const res = await fetch(`${BASE}/seminars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sem),
    });
    if (res.ok) {
      console.log(`ADD:  ${sem.date} ${sem.title} (${sem.type})`);
      added++;
    } else {
      console.error(`FAIL: ${sem.date}`, await res.text());
    }
  }
  console.log(`\n完了: ${added}件追加`);
}

main().catch(console.error);
