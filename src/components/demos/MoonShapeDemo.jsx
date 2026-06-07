const phases = ["🌙", "🌓", "🌔", "🌕"];

export default function MoonShapeDemo({ moonPhase, setMoonPhase }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-indigo-950 p-6 text-white">
      <button
        type="button"
        aria-label="切换月亮形状"
        onClick={() => setMoonPhase((moonPhase + 1) % phases.length)}
        className="rounded-full p-2 text-7xl transition hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
      >
        {phases[moonPhase]}
      </button>
      <p aria-live="polite" className="mt-4 text-sm text-indigo-100">
        点月亮：弯月 → 半月 → 接近圆月 → 圆月
      </p>
    </div>
  );
}
