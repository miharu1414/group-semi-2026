-- 班ゼミ管理アプリ スキーマ定義

CREATE TABLE IF NOT EXISTS seminars (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('rinudoku', 'zentai', 'kenkyu')),
  title TEXT NOT NULL DEFAULT '',
  assignee_a TEXT NOT NULL DEFAULT '',
  assignee_b TEXT NOT NULL DEFAULT '',
  assignee_c TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seminars_date ON seminars(date);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  order_num INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータ（メンバー）
INSERT OR IGNORE INTO members (id, name, role, order_num) VALUES
  ('m-001', '田中 太郎', 'M2', 1),
  ('m-002', '鈴木 花子', 'M1', 2),
  ('m-003', '佐藤 次郎', 'M1', 3),
  ('m-004', '山田 三郎', 'B4', 4);

-- サンプルデータ（ゼミ予定）
INSERT OR IGNORE INTO seminars (id, date, type, title, assignee_a, assignee_b, assignee_c, notes) VALUES
  ('s-001', '2026-07-07', 'rinudoku', '第1章まとめ', '田中 太郎', '鈴木 花子', '佐藤 次郎', ''),
  ('s-002', '2026-07-14', 'zentai', '中間発表準備', '山田 三郎', '田中 太郎', '', '資料を事前共有'),
  ('s-003', '2026-07-21', 'kenkyu', '研究進捗共有', '鈴木 花子', '佐藤 次郎', '山田 三郎', '');
