import { CheckCircle2 } from "lucide-react";

export default function LessonCard({
  lesson,
  category,
  isCompleted,
  onOpen,
  variant = "default",
}) {
  const visibleTags = (lesson.tags || []).slice(0, 3);

  if (variant === "related") {
    return (
      <button
        type="button"
        aria-label={`打开课程：${lesson.title}`}
        onClick={onOpen}
        className="rounded-[1.25rem] bg-slate-50 p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="text-4xl">{lesson.emoji}</div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isCompleted ? "bg-green-100 text-green-700" : "bg-white text-slate-500"
            }`}
          >
            {isCompleted ? "已完成" : lesson.readingTime}
          </span>
        </div>
        <h3 className="mt-3 text-base font-black leading-6">{lesson.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {lesson.question || lesson.intro}
        </p>
        <div className="mt-3 text-xs font-semibold text-slate-400">
          {category?.label || "百科主题"}
          {lesson.ageRange ? ` · 适合 ${lesson.ageRange}` : ""}
        </div>
        {visibleTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`打开课程：${lesson.title}`}
      onClick={onOpen}
      className="rounded-[1.5rem] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="text-5xl">{lesson.emoji}</div>
        {isCompleted ? (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <CheckCircle2 className="h-3 w-3" /> 已完成
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {lesson.readingTime}
          </span>
        )}
      </div>
      <h3 className="text-xl font-black leading-tight">{lesson.title}</h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{lesson.intro}</p>
      {visibleTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-500">
        <span>{lesson.level}</span>
        {lesson.ageRange && (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
            适合 {lesson.ageRange}
          </span>
        )}
        <span>打开 →</span>
      </div>
    </button>
  );
}
