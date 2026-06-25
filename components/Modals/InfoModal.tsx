'use client';

import { X, BookOpen, Users, MapPin, Clock, Lightbulb, ListOrdered } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLES = [
  {
    label: 'A 担当',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    items: [
      '輪読本の内容説明を担当',
      'メモや板書を使いながら進行',
      '数式なども追う',
    ],
  },
  {
    label: 'B 担当',
    color: 'bg-violet-50 border-violet-200 text-violet-900',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    items: [
      '関連研究・活用事例の紹介',
      'A・C 担当以外の残りのメンバー全員',
      'スライド／メモ／リンク／論文本体など何らかの資料を用意',
    ],
  },
  {
    label: 'C 担当',
    color: 'bg-teal-50 border-teal-200 text-teal-900',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
    items: [
      'コラム・基礎復習・周辺知識を紹介',
      'スライド／PDF／ドキュメントのいずれかを用意',
    ],
  },
];

const FLOW = [
  { time: '15分', desc: 'ファイナンスの復習' },
  { time: '60分', desc: 'A 輪読（内容説明）' },
  { time: '15〜30分', desc: 'C コラム・周辺知識' },
  { time: '各15分', desc: 'B 関連研究・活用事例' },
];

export default function InfoModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div
          className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh] rounded-t-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="ゼミ概要"
        >
          {/* Handle bar (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">ゼミ概要・役割説明</h2>
                <p className="text-xs text-gray-500 mt-0.5">独学で鍛える数理思考２（古嶋十潤）</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="閉じる"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

            {/* 目的 */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                <Lightbulb size={15} className="text-amber-500" /> 目的
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                蓮池研究メンバーの研究に対して、自分なりのコメント・意見・疑問・示唆を持てるようになること
              </p>
            </section>

            {/* 基本情報 */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <Users size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">参加予定者</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    M2: 並木<br />
                    M1: 近藤<br />
                    B4: 有田・篠塚（院試後から参加）
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <MapPin size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">開催日時・場所</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    毎週水曜日 3・4限<br />
                    ゼミ室 14-02<br />
                    <span className="text-xs text-gray-500">2週間で1章程度が目安</span>
                  </p>
                </div>
              </div>
            </section>

            {/* 役割説明 */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                <Users size={15} className="text-indigo-500" /> 各担当の役割
              </h3>
              <div className="space-y-2.5">
                {ROLES.map((role) => (
                  <div key={role.label} className={`rounded-xl border px-4 py-3 ${role.color}`}>
                    <p className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border mb-2 ${role.badge}`}>
                      {role.label}
                    </p>
                    <ul className="space-y-1">
                      {role.items.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-1.5">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-current opacity-40 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 進行目安 */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                <Clock size={15} className="text-indigo-500" /> 進行目安（計 2時間弱〜2時間半）
              </h3>
              <ol className="space-y-2">
                {FLOW.map((step, i) => (
                  <li key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-800 flex-1">{step.desc}</span>
                    <span className="text-xs font-semibold text-gray-500 shrink-0">{step.time}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* カレンダー凡例 */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                <ListOrdered size={15} className="text-indigo-500" /> カレンダー凡例
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { dot: 'bg-indigo-500',  label: '輪読ゼミ',  desc: '教科書の輪読' },
                  { dot: 'bg-violet-500',  label: '全体ゼミ',  desc: '全体発表・共有' },
                  { dot: 'bg-teal-500',    label: '研究共有会', desc: '研究進捗発表' },
                  { dot: 'bg-orange-500',  label: 'その他',    desc: '合宿・特別イベントなど' },
                ].map(({ dot, label, desc }) => (
                  <div key={label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 全体メモ */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                <ListOrdered size={15} className="text-indigo-500" /> 全体メモ
              </h3>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-900 leading-relaxed space-y-1">
                <p>本の内容確認だけでなく、関連研究や事例に広げて深めることも大切</p>
                <p className="text-xs text-indigo-600">10/7以降も毎週水曜日を基本として継続予定</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
