import { RotateCcw } from "lucide-react";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}

export default function ProgressSummary({
  completedCount,
  totalCount,
  percentage,
  onReset,
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">探索进度</h2>
          <p className="mt-1 text-sm text-slate-500">每完成一个主题，就点亮一个小徽章。</p>
        </div>
        <span className="rounded-full bg-amber-100 px-4 py-2 text-lg font-black">
          {percentage}%
        </span>
      </div>
      <div className="mt-5">
        <div className="flex items-end justify-between">
          <div className="text-4xl font-black">{completedCount}</div>
          <div className="pb-1 text-sm font-semibold text-slate-500">/ {totalCount} 个主题</div>
        </div>
        <div
          role="progressbar"
          aria-label="探索进度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          className="mt-3 h-4 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard label="主题" value={totalCount} />
        <StatCard label="完成" value={completedCount} />
        <StatCard label="徽章" value={completedCount} />
      </div>
      <button
        type="button"
        aria-label="重置学习进度"
        onClick={onReset}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
      >
        <RotateCcw className="h-4 w-4" /> 重置原型进度
      </button>
    </div>
  );
}
