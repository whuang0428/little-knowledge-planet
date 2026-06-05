import { Fragment, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { lessons } from "./data/lessons";
import { categories } from "./data/categories";
import {
  BookOpen,
  Star,
  Trophy,
  CheckCircle2,
  Home,
  Sparkles,
  RotateCcw,
} from "lucide-react";
function getStoredCompleted() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem("completedLessons") || "[]");
  } catch {
    return [];
  }
}

function saveStoredCompleted(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("completedLessons", JSON.stringify(ids));
}

export default function ChildrenKnowledgeExplorerPrototype() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const [view, setView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completed, setCompleted] = useState(getStoredCompleted);
  const [moonPhase, setMoonPhase] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [rewardStatus, setRewardStatus] = useState(null);

  const recommendedLesson =
    ["rainbow", "cat-eyes", "sunflower", "moon-shape", "pipa-string"]
      .map((id) => lessons.find((lesson) => lesson.id === id))
      .find(Boolean) || lessons[0];
  const recommendedCategory = categories.find((category) => category.id === recommendedLesson.category);
  const activeCategory = categories.find((category) => category.id === activeLesson.category);
  const lessonById = useMemo(() => new Map(lessons.map((lesson) => [lesson.id, lesson])), []);

  const filteredLessons = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();

    return lessons.filter((lesson) => {
      if (selectedCategory !== "all" && lesson.category !== selectedCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const categoryLabel = categories.find((category) => category.id === lesson.category)?.label || "";
      const searchableText = [
        lesson.title,
        lesson.intro,
        categoryLabel,
        lesson.question,
        lesson.discovery,
        lesson.funFact,
        ...(lesson.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [selectedCategory, searchQuery]);

  const correctCount = activeLesson.quiz.reduce((count, item, index) => {
    return selectedAnswers[index] === item.answer ? count + 1 : count;
  }, 0);

  const allAnswered = activeLesson.quiz.every((_, index) => selectedAnswers[index] !== undefined);
  const passed = allAnswered && correctCount === activeLesson.quiz.length;

  function openLesson(lesson) {
    setActiveLesson(lesson);
    setSelectedAnswers({});
    setShowReflection(false);
    setRewardStatus(null);
    setView("lesson");
  }

  function markCompleted() {
    const alreadyCompleted = completed.includes(activeLesson.id);
    if (!alreadyCompleted) {
      const next = [...completed, activeLesson.id];
      setCompleted(next);
      saveStoredCompleted(next);
    }
    setRewardStatus(alreadyCompleted ? "repeat" : "new");
    setShowReflection(true);
  }

  function selectQuizAnswer(index, optionIndex) {
    const nextAnswers = {
      ...selectedAnswers,
      [index]: optionIndex,
    };

    setSelectedAnswers(nextAnswers);

    const nextPassed = activeLesson.quiz.every((item, quizIndex) => nextAnswers[quizIndex] === item.answer);
    if (nextPassed) {
      markCompleted();
    } else {
      setShowReflection(false);
      setRewardStatus(null);
    }
  }

  function resetProgress() {
    setCompleted([]);
    saveStoredCompleted([]);
  }

  const progressPercent = Math.round((completed.length / lessons.length) * 100);
  const incompleteLessons = lessons.filter((lesson) => !completed.includes(lesson.id));
  const continueLessons = incompleteLessons.filter((lesson) => lesson.id !== recommendedLesson.id).slice(0, 3);
  const homeSuggestions = continueLessons.length > 0 ? continueLessons : incompleteLessons.slice(0, 3);
  const relatedLessonSuggestions = useMemo(() => {
    const suggestions = [];
    const seenIds = new Set([activeLesson.id]);

    function addLesson(lesson) {
      if (!lesson || seenIds.has(lesson.id) || suggestions.length >= 3) return;
      seenIds.add(lesson.id);
      suggestions.push(lesson);
    }

    (activeLesson.relatedLessons || []).forEach((lessonId) => addLesson(lessonById.get(lessonId)));
    lessons
      .filter((lesson) => lesson.category === activeLesson.category)
      .forEach(addLesson);
    lessons
      .filter((lesson) => !completed.includes(lesson.id))
      .forEach(addLesson);
    lessons.forEach(addLesson);

    return suggestions;
  }, [activeLesson, completed, lessonById]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-amber-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold">小小百科星球</div>
              <div className="text-xs text-slate-500">每天一点点，探索大世界</div>
            </div>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm">
              已完成 {completed.length}/{lessons.length}
            </div>
            <button
              onClick={() => setView("badges")}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm transition hover:bg-amber-50"
            >
              <Trophy className="h-4 w-4" /> 我的徽章
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-200 via-orange-100 to-white p-6 shadow-sm md:p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-bold">
                    <Sparkles className="h-4 w-4" /> 小小百科星球
                  </div>
                  <h1 className="max-w-2xl text-3xl font-black leading-tight md:text-5xl">
                    今天想发现什么新秘密？
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                    选一个好奇的问题，点一点、看一看，把小知识变成自己的发现。
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setView("library")}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <BookOpen className="h-5 w-5" /> 去探索主题
                    </button>
                    <button
                      onClick={() => setView("badges")}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Trophy className="h-5 w-5" /> 看我的徽章
                    </button>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black">探索进度</h2>
                      <p className="mt-1 text-sm text-slate-500">每完成一个主题，就点亮一个小徽章。</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-lg font-black">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-end justify-between">
                      <div className="text-4xl font-black">{completed.length}</div>
                      <div className="pb-1 text-sm font-semibold text-slate-500">/ {lessons.length} 个主题</div>
                    </div>
                    <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <StatCard label="主题" value={lessons.length} />
                    <StatCard label="完成" value={completed.length} />
                    <StatCard label="徽章" value={completed.length} />
                  </div>
                  <button
                    onClick={resetProgress}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    <RotateCcw className="h-4 w-4" /> 重置原型进度
                  </button>
                </div>
              </section>

              <section className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
                <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold">
                      <Star className="h-4 w-4" /> 今日推荐探索
                    </div>
                    <div className="text-6xl">{recommendedLesson.emoji}</div>
                    <h2 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
                      {recommendedLesson.title}
                    </h2>
                    <p className="mt-3 leading-7 text-slate-600">{recommendedLesson.intro}</p>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">
                        {recommendedCategory?.label || "百科主题"}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">
                        {recommendedLesson.readingTime}
                      </span>
                      {completed.includes(recommendedLesson.id) && (
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          <CheckCircle2 className="h-4 w-4" /> 已完成
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      这个主题有真实互动，可以边玩边观察一个小现象。
                    </p>
                    <button
                      onClick={() => openLesson(recommendedLesson)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      开始这个探索
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">继续探索</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {incompleteLessons.length > 0 ? "挑一个还没完成的小问题继续前进。" : "所有主题都完成啦，可以回去看看点亮的徽章。"}
                    </p>
                  </div>
                  {incompleteLessons.length === 0 && (
                    <button
                      onClick={() => setView("badges")}
                      className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm md:block"
                    >
                      查看徽章
                    </button>
                  )}
                </div>
                {incompleteLessons.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {homeSuggestions.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        completed={false}
                        onOpen={() => openLesson(lesson)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] bg-green-50 p-6 text-center shadow-sm">
                    <div className="text-5xl">🏅</div>
                    <h3 className="mt-3 text-2xl font-black">你已经点亮整颗星球！</h3>
                    <p className="mt-2 text-slate-600">去徽章页看看自己的探索成果吧。</p>
                    <button
                      onClick={() => setView("badges")}
                      className="mt-5 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      查看我的徽章
                    </button>
                  </div>
                )}
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">知识分类</h2>
                    <p className="mt-1 text-sm text-slate-500">从动物、植物、宇宙、自然、音乐、人体、科学实验和生活发现开始。</p>
                  </div>
                  <button
                    onClick={() => setView("library")}
                    className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm md:block"
                  >
                    全部打开
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categories.slice(1).map((category) => {
                    const Icon = category.icon;
                    const count = lessons.filter((lesson) => lesson.category === category.id).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setView("library");
                        }}
                        className="rounded-[1.5rem] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${category.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-lg font-bold">{category.label}</div>
                        <div className="mt-1 text-sm text-slate-500">{count} 个小主题</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {view === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <button
                    onClick={() => setView("home")}
                    className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm"
                  >
                    <Home className="h-4 w-4" /> 返回首页
                  </button>
                  <h1 className="text-3xl font-black md:text-4xl">全部探索主题</h1>
                  <p className="mt-2 text-slate-500">可以按分类选择，也可以直接打开一个知识卡片。</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                <label htmlFor="lesson-search" className="mb-2 block text-sm font-black text-slate-600">
                  搜一搜小知识
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="lesson-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="想知道什么？试试搜索“彩虹”“月亮”“动物”……"
                    className="min-h-12 flex-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      清空搜索
                    </button>
                  )}
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-500">
                  找到 {filteredLessons.length} 个探索主题
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const active = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active ? "bg-slate-900 text-white" : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {category.label}
                    </button>
                  );
                })}
              </div>

              {filteredLessons.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      completed={completed.includes(lesson.id)}
                      onOpen={() => openLesson(lesson)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
                  <div className="text-5xl">🔍</div>
                  <h2 className="mt-3 text-2xl font-black">还没有找到这个主题</h2>
                  <p className="mx-auto mt-2 max-w-md leading-7 text-slate-500">
                    换个词试试看，比如“动物”“天空”“声音”。
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-5 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    清空搜索
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {view === "lesson" && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-4xl space-y-5"
            >
              <button
                onClick={() => setView("library")}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm"
              >
                <Home className="h-4 w-4" /> 返回主题列表
              </button>

              <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
                <div className="bg-gradient-to-br from-amber-100 via-white to-sky-100 p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">
                      {activeCategory?.label || "百科主题"}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">{activeLesson.readingTime}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">{activeLesson.level}</span>
                    {completed.includes(activeLesson.id) && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        <CheckCircle2 className="h-4 w-4" /> 已完成
                      </span>
                    )}
                  </div>
                  <div className="text-6xl">{activeLesson.emoji}</div>
                  <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{activeLesson.title}</h1>
                  <p className="mt-4 text-lg leading-8 text-slate-600">{activeLesson.intro}</p>
                </div>

                <div className="space-y-6 p-6 md:p-8">
                  <div className="rounded-[1.5rem] bg-amber-50 p-5 shadow-sm ring-1 ring-amber-100">
                    <div className="mb-2 text-sm font-black text-amber-700">今天的问题</div>
                    <p className="text-2xl font-black leading-9 text-slate-800">
                      {activeLesson.question || activeLesson.title}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-5">
                    <h2 className="mb-3 text-xl font-bold">简单解释</h2>
                    <p className="text-lg leading-9 text-slate-700">{activeLesson.content}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-100 p-5">
                    <h2 className="mb-3 text-xl font-bold">动一动，看一看</h2>
                    <p className="mb-4 text-slate-500">{activeLesson.interaction}</p>
                    <InteractiveDemo lesson={activeLesson} moonPhase={moonPhase} setMoonPhase={setMoonPhase} />
                  </div>

                  {activeLesson.discovery && (
                    <div className="rounded-[1.5rem] bg-green-50 p-5 shadow-sm ring-1 ring-green-100">
                      <div className="mb-2 text-sm font-black text-green-700">我发现了什么</div>
                      <p className="text-lg font-semibold leading-8 text-slate-700">{activeLesson.discovery}</p>
                    </div>
                  )}

                  {activeLesson.funFact && (
                    <div className="rounded-[1.5rem] bg-sky-50 p-5 shadow-sm ring-1 ring-sky-100">
                      <div className="mb-2 text-sm font-black text-sky-700">趣味小知识</div>
                      <p className="text-lg font-semibold leading-8 text-slate-700">{activeLesson.funFact}</p>
                    </div>
                  )}

                  <div className="rounded-[1.5rem] bg-amber-50 p-5">
                    <h2 className="mb-4 text-xl font-bold">三道小测验</h2>
                    <div className="space-y-5">
                      {activeLesson.quiz.map((item, index) => (
                        <div key={item.question} className="rounded-2xl bg-white p-4 shadow-sm">
                          <div className="font-semibold">
                            {index + 1}. {item.question}
                          </div>
                          <div className="mt-3 grid gap-2 md:grid-cols-3">
                            {item.options.map((option, optionIndex) => {
                              const selected = selectedAnswers[index] === optionIndex;
                              const answered = selectedAnswers[index] !== undefined;
                              const isCorrect = item.answer === optionIndex;
                              const selectedCorrect = selected && isCorrect;
                              const selectedIncorrect = selected && !isCorrect;
                              return (
                                <button
                                  key={option}
                                  onClick={() => selectQuizAnswer(index, optionIndex)}
                                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                                    selectedCorrect
                                      ? "border-green-400 bg-green-50 text-green-700 ring-2 ring-green-100"
                                      : selectedIncorrect
                                      ? "border-red-300 bg-red-50 text-red-700 ring-2 ring-red-100"
                                      : answered && isCorrect
                                      ? "border-green-300 bg-green-50 text-green-700"
                                      : answered
                                      ? "border-slate-100 bg-slate-50 text-slate-400"
                                      : "border-slate-100 bg-slate-50 hover:bg-white"
                                  }`}
                                >
                                  <span>{option}</span>
                                  {answered && isCorrect && <span className="ml-2 font-black">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                          {selectedAnswers[index] !== undefined && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`mt-3 rounded-2xl p-4 text-sm leading-6 ${
                                selectedAnswers[index] === item.answer
                                  ? "bg-green-50 text-green-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <div className="font-black">
                                {selectedAnswers[index] === item.answer ? "答对啦！" : "差一点点，再看看小提示。"}
                              </div>
                              <p className="mt-1">{item.explanation}</p>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl bg-white p-4 text-center shadow-sm">
                      {allAnswered ? (
                        <div>
                          <div className="text-lg font-bold">
                            答对 {correctCount}/{activeLesson.quiz.length} 题
                          </div>
                          {passed ? (
                            <p className="mt-1 text-sm text-green-600">太棒了，可以领取今天的徽章！</p>
                          ) : (
                            <p className="mt-1 text-sm text-slate-500">没关系，再看一遍解释，再试一次。</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">完成三道题后，就能看到结果。</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <h2 className="mb-2 text-xl font-bold">讲给爸爸妈妈听</h2>
                    <p className="leading-7 text-slate-600">{activeLesson.parentPrompt}</p>
                  </div>

                  {passed && showReflection && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-[1.5rem] bg-gradient-to-br from-green-100 to-emerald-50 p-6 text-center shadow-sm"
                    >
                      <div className="text-6xl">🏅</div>
                      <div className="mt-3 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-black text-green-700 shadow-sm">
                        徽章：{activeLesson.badge}
                      </div>
                      <h2 className="mt-4 text-2xl font-black">
                        {rewardStatus === "repeat" ? "你已经获得过这个徽章啦" : "太棒了，徽章点亮啦！"}
                      </h2>
                      <p className="mx-auto mt-2 max-w-xl leading-7 text-slate-600">
                        {rewardStatus === "repeat"
                          ? "再复习一次也很厉害，知识会记得更牢。"
                          : "三道题都答对了，你把今天的小秘密带回家啦。"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-green-700">
                        还可以继续看看下面的相关小秘密。
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                          onClick={() => setView("library")}
                          className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          返回主题列表
                        </button>
                        <button
                          onClick={() => setView("badges")}
                          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          查看徽章进度
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {relatedLessonSuggestions.length > 0 && (
                    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                        <div>
                          <h2 className="text-2xl font-black">继续发现</h2>
                          <p className="mt-1 text-sm text-slate-500">
                            这个问题还可以带你去看看这些小秘密。
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        {relatedLessonSuggestions.map((lesson) => (
                          <RelatedLessonCard
                            key={lesson.id}
                            lesson={lesson}
                            completed={completed.includes(lesson.id)}
                            onOpen={() => openLesson(lesson)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {view === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <button
                onClick={() => setView("home")}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm"
              >
                <Home className="h-4 w-4" /> 返回首页
              </button>
              <div>
                <h1 className="text-3xl font-black md:text-4xl">我的探索徽章</h1>
                <p className="mt-2 text-slate-500">每完成一个主题，就点亮一个小徽章。</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson) => {
                  const unlocked = completed.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-[1.5rem] p-5 shadow-sm transition ${
                        unlocked ? "bg-white" : "bg-slate-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
                          {unlocked ? "🏅" : "🔒"}
                        </div>
                        <div>
                          <div className="font-bold">{lesson.badge}</div>
                          <div className="text-sm text-slate-500">{lesson.title}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-xl md:hidden">
        <MobileNavButton icon={Home} label="首页" active={view === "home"} onClick={() => setView("home")} />
        <MobileNavButton icon={BookOpen} label="主题" active={view === "library"} onClick={() => setView("library")} />
        <MobileNavButton icon={Trophy} label="徽章" active={view === "badges"} onClick={() => setView("badges")} />
      </nav>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}


function LessonCard({ lesson, completed, onOpen }) {
  const visibleTags = (lesson.tags || []).slice(0, 3);

  return (
    <button
      onClick={onOpen}
      className="rounded-[1.5rem] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="text-5xl">{lesson.emoji}</div>
        {completed ? (
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
      <div className="mt-5 flex items-center justify-between text-sm font-semibold text-slate-500">
        <span>{lesson.level}</span>
        <span>打开 →</span>
      </div>
    </button>
  );
}

function RelatedLessonCard({ lesson, completed, onOpen }) {
  const visibleTags = (lesson.tags || []).slice(0, 3);
  const category = categories.find((item) => item.id === lesson.category);

  return (
    <button
      onClick={onOpen}
      className="rounded-[1.25rem] bg-slate-50 p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-4xl">{lesson.emoji}</div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
          completed ? "bg-green-100 text-green-700" : "bg-white text-slate-500"
        }`}>
          {completed ? "已完成" : lesson.readingTime}
        </span>
      </div>
      <h3 className="mt-3 text-base font-black leading-6">{lesson.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
        {lesson.question || lesson.intro}
      </p>
      <div className="mt-3 text-xs font-semibold text-slate-400">
        {category?.label || "百科主题"}
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

function InteractiveDemo({ lesson, moonPhase, setMoonPhase }) {
  const lessonId = lesson.id;
  if (lessonId === "cat-eyes") {
    return <CatEyesDemo />;
  }

  if (lessonId === "penguin-feet") {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-sky-50 p-6">
        <div className="flex items-end gap-8">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="text-7xl"
          >
            🐧
          </motion.div>

          <div className="space-y-2">
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              身体：厚羽毛保暖
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              脚：减少热量流失
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              群体：挤在一起取暖
            </div>
          </div>
        </div>

        <div className="mt-5 h-3 w-full max-w-md rounded-full bg-sky-200">
          <motion.div
            animate={{ width: ["25%", "70%", "25%"] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="h-full rounded-full bg-slate-800"
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          黑色条表示热量流动：企鹅会尽量减少热量从脚上跑走。
        </p>
      </div>
    );
  }

  if (lessonId === "sunflower") {
    return <SunflowerDemo />;
  }

  if (lessonId === "moon-shape") {
    const phases = ["🌙", "🌓", "🌔", "🌕"];
    return (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-indigo-950 p-6 text-white">
        <button
          onClick={() => setMoonPhase((moonPhase + 1) % phases.length)}
          className="text-7xl transition hover:scale-110"
        >
          {phases[moonPhase]}
        </button>
        <p className="mt-4 text-sm text-indigo-100">
          点月亮：弯月 → 半月 → 接近圆月 → 圆月
        </p>
      </div>
    );
  }

  if (lessonId === "rainbow") {
    return <RainbowDemo />;
  }

  if (lessonId === "pipa-string") {
    return <PipaStringDemo />;
  }

  return <CategoryExploreDemo key={lesson.id} lesson={lesson} />;
}

// Legacy static demo kept unmounted; current generic lessons use CategoryExploreDemo.
// eslint-disable-next-line no-unused-vars
function SimpleExploreDemo({ lessonId }) {
  const demoMap = {
    "giraffe-neck": {
      bg: "bg-orange-50",
      icon: "🦒",
      title: "高处的叶子",
      text: "长脖子可以帮助长颈鹿吃到其他动物够不到的叶子。",
    },
    "octopus-hearts": {
      bg: "bg-blue-50",
      icon: "🐙",
      title: "三个心脏",
      text: "两个帮助血液经过鳃，一个帮助血液流向身体。",
    },
    "bee-dance": {
      bg: "bg-yellow-50",
      icon: "🐝",
      title: "蜜蜂传消息",
      text: "蜜蜂用舞蹈告诉同伴花蜜的大概方向和距离。",
    },
    "cactus-water": {
      bg: "bg-green-50",
      icon: "🌵",
      title: "小水库",
      text: "仙人掌把水存在身体里，刺可以减少水分流失。",
    },
    "leaf-green": {
      bg: "bg-green-50",
      icon: "🍃",
      title: "叶绿素",
      text: "叶绿素帮助植物利用阳光制造食物。",
    },
    "tree-rings": {
      bg: "bg-amber-50",
      icon: "🌳",
      title: "成长圆圈",
      text: "年轮像树木留下的成长记录。",
    },
    "seed-travel": {
      bg: "bg-lime-50",
      icon: "🌱",
      title: "种子旅行",
      text: "有些种子靠风，有些靠动物，去新的地方生长。",
    },
    "day-night": {
      bg: "bg-indigo-50",
      icon: "🌍",
      title: "地球转动",
      text: "朝向太阳的一面是白天，背对太阳的一面是黑夜。",
    },
    "stars-day": {
      bg: "bg-slate-900 text-white",
      icon: "⭐",
      title: "星星没有消失",
      text: "白天太阳光太亮，所以我们不容易看到星星。",
    },
    "rocket-fly": {
      bg: "bg-red-50",
      icon: "🚀",
      title: "向下喷，向上飞",
      text: "火箭向下喷出强气体，所以被推着向上飞。",
    },
    "planets-round": {
      bg: "bg-purple-50",
      icon: "🪐",
      title: "引力往中心拉",
      text: "很大的星球会被引力拉成接近圆球的形状。",
    },
    "thunder-lightning": {
      bg: "bg-yellow-50",
      icon: "⚡",
      title: "光比声音快",
      text: "所以我们先看到闪电，再听到雷声。",
    },
    "volcano": {
      bg: "bg-red-50",
      icon: "🌋",
      title: "岩浆往外冲",
      text: "地球内部的热岩浆和气体可能从薄弱地方冲出来。",
    },
    "cloud-rain": {
      bg: "bg-sky-50",
      icon: "☁️",
      title: "小水滴变重",
      text: "云里的小水滴越来越多，太重了就落下来变成雨。",
    },
    "desert-cold-night": {
      bg: "bg-orange-50",
      icon: "🏜️",
      title: "白天热，晚上冷",
      text: "沙漠水分少，升温快，散热也快。",
    },
    "sound-travel": {
      bg: "bg-pink-50",
      icon: "👂",
      title: "声音在空气里旅行",
      text: "声音让空气振动，再传到我们的耳朵里。",
    },
    "echo": {
      bg: "bg-slate-50",
      icon: "🏔️",
      title: "声音反弹回来",
      text: "声音遇到山壁或墙壁，可能会反射回来形成回声。",
    },
    "instrument-wood": {
      bg: "bg-amber-50",
      icon: "🪵",
      title: "木头帮助放大声音",
      text: "琴弦振动后，木头琴身也会一起振动。",
    },
    "rhythm-heart": {
      bg: "bg-rose-50",
      icon: "🥁",
      title: "节奏有规律",
      text: "大脑抓住规律后，身体就容易想跟着动。",
    },
    "heartbeat": {
      bg: "bg-red-50",
      icon: "❤️",
      title: "身体里的小水泵",
      text: "心脏把血液送到身体各处。",
    },
    "teeth-change": {
      bg: "bg-slate-50",
      icon: "🦷",
      title: "乳牙换恒牙",
      text: "身体长大后，需要更结实的牙齿。",
    },
    "brain-sleep": {
      bg: "bg-purple-50",
      icon: "🧠",
      title: "大脑整理书架",
      text: "睡觉时，大脑会整理白天学到的东西。",
    },
    "goosebumps": {
      bg: "bg-blue-50",
      icon: "🧥",
      title: "身体的保暖反应",
      text: "冷的时候，身体会做出一些自动反应。",
    },
    "taste": {
      bg: "bg-pink-50",
      icon: "👅",
      title: "味觉感受器",
      text: "舌头把味道信息传给大脑。",
    },
    "magnet": {
      bg: "bg-purple-50",
      icon: "🧲",
      title: "看不见的磁力",
      text: "磁铁可以吸引铁等一些材料。",
    },
    "float-sink": {
      bg: "bg-cyan-50",
      icon: "🛟",
      title: "浮起来还是沉下去",
      text: "这和材料、形状、水的托力都有关系。",
    },
    "shadow": {
      bg: "bg-slate-50",
      icon: "👤",
      title: "光被挡住",
      text: "光被物体挡住后，就会形成影子。",
    },
    "ice-melt": {
      bg: "bg-blue-50",
      icon: "🧊",
      title: "冰吸收热量",
      text: "温度升高后，冰会融化成水。",
    },
    "static-electricity": {
      bg: "bg-yellow-50",
      icon: "✨",
      title: "摩擦产生静电",
      text: "衣服摩擦后可能积累静电，碰到东西时会放电。",
    },
    "soap-clean": {
      bg: "bg-sky-50",
      icon: "🧼",
      title: "肥皂包住脏东西",
      text: "肥皂可以帮助油污被水冲走。",
    },
    "traffic-light": {
      bg: "bg-green-50",
      icon: "🚦",
      title: "颜色告诉我们规则",
      text: "红灯停，绿灯行，黄灯提醒注意。",
    },
    "fridge": {
      bg: "bg-blue-50",
      icon: "🧊",
      title: "低温让变化变慢",
      text: "冰箱温度低，可以让很多细菌活动变慢。",
    },
    "umbrella": {
      bg: "bg-sky-50",
      icon: "☂️",
      title: "雨水滑到旁边",
      text: "伞面防水，弧形能让雨水流走。",
    },
    "elevator": {
      bg: "bg-slate-50",
      icon: "🛗",
      title: "按钮告诉电梯去哪",
      text: "电动机和控制系统帮助电梯上下移动。",
    },
  };

  const demo = demoMap[lessonId] || {
    bg: "bg-slate-50",
    icon: "🔍",
    title: "小小观察",
    text: "看一看这个现象，想一想它背后的原因。",
  };

  return (
    <div className={`min-h-40 rounded-2xl p-6 ${demo.bg}`}>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <motion.div
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="cursor-pointer text-7xl"
        >
          {demo.icon}
        </motion.div>

        <div>
          <div className="text-lg font-black">{demo.title}</div>
          <p className="mt-2 max-w-md text-sm leading-6 opacity-80">
            {demo.text}
          </p>
        </div>
      </div>
    </div>
  );
}

function CatEyesDemo() {
  const [showReflection, setShowReflection] = useState(false);

  return (
    <div className="relative flex min-h-40 flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-900 p-6 text-white">
      <motion.div
        animate={{ opacity: showReflection ? 1 : 0.25, x: showReflection ? 18 : 0 }}
        className="absolute left-5 top-16 h-2 w-24 rounded-full bg-amber-200/80 blur-sm"
      />
      <motion.button
        type="button"
        aria-pressed={showReflection}
        onClick={() => setShowReflection((value) => !value)}
        whileTap={{ scale: 0.92 }}
        className="relative flex cursor-pointer gap-6 rounded-full bg-slate-800 px-8 py-6 transition hover:bg-slate-700"
      >
        {[0, 1].map((eye) => (
          <motion.div
            key={eye}
            animate={{
              boxShadow: showReflection
                ? ["0 0 12px #fde68a", "0 0 42px #fde68a", "0 0 12px #fde68a"]
                : ["0 0 0px #fde68a", "0 0 18px #fde68a", "0 0 0px #fde68a"],
              scale: showReflection ? [1, 1.12, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 1.8, delay: eye * 0.15 }}
            className="h-12 w-12 rounded-full bg-yellow-200"
          />
        ))}
      </motion.button>
      <p className="mt-4 text-sm text-slate-300">
        {showReflection ? "光照过来后，猫眼把光反射回来，亮得更明显。" : "点击小猫眼睛，打开一束小光看看反射。"}
      </p>
    </div>
  );
}

function SunflowerDemo() {
  const sunX = useMotionValue(0);
  const flowerRotate = useTransform(sunX, [-220, 20], [-18, 14]);
  const flowerX = useTransform(sunX, [-220, 20], [-10, 8]);
  const beamRotate = useTransform(sunX, [-220, 20], [-16, 8]);
  const beamScale = useTransform(sunX, [-220, 20], [0.58, 1]);

  return (
    <div className="relative flex min-h-48 items-center justify-between overflow-hidden rounded-2xl bg-green-50 p-6">
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-green-100/80 to-transparent" />

      <motion.div
        style={{ rotate: beamRotate, scaleX: beamScale }}
        className="pointer-events-none absolute left-24 right-24 top-20 h-3 origin-right rounded-full bg-yellow-200/70 blur-sm"
      />
      <motion.div
        style={{ rotate: beamRotate, scaleX: beamScale }}
        className="pointer-events-none absolute left-28 right-28 top-24 h-1.5 origin-right rounded-full bg-amber-300/60"
      />

      <motion.div
        style={{ rotate: flowerRotate, x: flowerX, transformOrigin: "50% 100%" }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="relative z-10 text-7xl"
      >
        🌻
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -220, right: 20 }}
        dragElastic={0.08}
        style={{ x: sunX }}
        whileDrag={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 cursor-grab text-7xl active:cursor-grabbing"
      >
        ☀️
      </motion.div>

      <p className="absolute bottom-4 left-6 right-6 z-10 text-center text-sm text-green-700">
        左右拖动太阳：向日葵会跟着光的方向转过去。
      </p>
    </div>
  );
}

function PipaStringDemo() {
  const [activeString, setActiveString] = useState("long");
  const isLong = activeString === "long";

  return (
    <div className="min-h-40 rounded-2xl bg-pink-50 p-6">
      <div className="space-y-5">
        <StringLine
          label="长弦：声音比较低"
          width="w-full"
          active={isLong}
          onClick={() => setActiveString("long")}
        />
        <StringLine
          label="短弦：声音比较高"
          width="w-1/2"
          active={!isLong}
          onClick={() => setActiveString("short")}
        />
      </div>
      <p className="mt-5 text-sm text-slate-500">
        {isLong ? "现在选中长弦：它振动得比较慢，声音通常比较低。" : "现在选中短弦：它振动得更快，声音通常比较高。"}
      </p>
    </div>
  );
}

function RainbowDemo() {
  const [splitLight, setSplitLight] = useState(false);
  const colors = [
    { name: "红", className: "bg-red-400" },
    { name: "橙", className: "bg-orange-400" },
    { name: "黄", className: "bg-yellow-300" },
    { name: "绿", className: "bg-green-400" },
    { name: "蓝", className: "bg-sky-400" },
    { name: "靛", className: "bg-indigo-400" },
    { name: "紫", className: "bg-purple-400" },
  ];

  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl bg-sky-50 p-6">
      <div className="flex w-full max-w-md items-center justify-center gap-3">
        <motion.div
          animate={{ width: splitLight ? 52 : 128, opacity: splitLight ? 0.45 : 1 }}
          className="h-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.95)] ring-1 ring-sky-100"
        />

        <motion.button
          type="button"
          aria-pressed={splitLight}
          onClick={() => setSplitLight((value) => !value)}
          whileTap={{ scale: 0.9 }}
          animate={{ y: splitLight ? [0, -4, 0] : 0 }}
          transition={{ repeat: splitLight ? Infinity : 0, duration: 1.8 }}
          className="cursor-pointer rounded-full bg-white/70 p-2 text-7xl shadow-sm transition hover:bg-white"
        >
          💧
        </motion.button>
      </div>

      <div className="mt-5 flex h-12 w-full max-w-md items-center justify-center overflow-hidden rounded-full bg-white/60 p-1 shadow-sm">
        {colors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={false}
            animate={{
              opacity: splitLight ? 1 : 0.2,
              width: splitLight ? 44 : 8,
              x: splitLight ? 0 : -18,
            }}
            transition={{ duration: 0.45, delay: splitLight ? index * 0.06 : 0 }}
            className={`flex h-full items-center justify-center text-xs font-black text-white ${color.className}`}
          >
            <motion.span animate={{ opacity: splitLight ? 1 : 0 }} transition={{ duration: 0.2 }}>
              {color.name}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-center text-sm leading-6 text-slate-500">
        {splitLight
          ? "看，白光穿过水滴后分成了红、橙、黄、绿、蓝、靛、紫。再点水滴可以合回去。"
          : "点击水滴，让这束白光分成不同颜色。"}
      </p>
    </div>
  );
}

function CategoryExploreDemo({ lesson }) {
  const [activeStep, setActiveStep] = useState(0);

  const templates = {
    animals: {
      bg: "bg-orange-50",
      activeCard: "bg-orange-600",
      mainIcon: lesson.emoji,
      title: "动物观察时间",
      visualType: "animals",
      states: [
        {
          name: "观察",
          step: "观察外形",
          message: "第 1 步：先看动物的外形，找找最容易发现的身体部分。",
          iconAnimation: { y: [0, -8, 0], rotate: 0, scale: 1 },
        },
        {
          name: "变化",
          step: "身体特点",
          message: "第 2 步：再找一个特别的身体特点，它可能是长脖子、软身体或灵活动作。",
          iconAnimation: { y: [0, -12, 0], rotate: [-5, 5, -5], scale: [1, 1.1, 1] },
        },
        {
          name: "解释",
          step: "生存用途",
          message: "第 3 步：想一想这个特点怎样帮助动物吃饭、躲危险或适应环境。",
          iconAnimation: { y: [0, -4, 0], rotate: [0, 8, -8, 0], scale: 1.05 },
        },
      ],
    },
    plants: {
      bg: "bg-green-50",
      activeCard: "bg-green-600",
      mainIcon: lesson.emoji,
      title: "植物生长小实验",
      visualType: "plants",
      states: [
        {
          name: "观察",
          step: "寻找阳光",
          message: "第 1 步：先看阳光在哪里，植物常常会朝光多的地方生长。",
          iconAnimation: { y: [0, -7, 0], rotate: [-3, 3, -3], scale: 1 },
        },
        {
          name: "变化",
          step: "需要水分",
          message: "第 2 步：再想水分怎样帮助植物保持挺立，也帮助它继续工作。",
          iconAnimation: { y: [0, -10, 0], rotate: 0, scale: [1, 1.12, 1] },
        },
        {
          name: "解释",
          step: "慢慢长大",
          message: "第 3 步：最后把阳光和水连起来，解释植物为什么能慢慢长高长大。",
          iconAnimation: { y: [0, -14, 0], rotate: [0, 4, -4, 0], scale: [1, 1.08, 1] },
        },
      ],
    },
    space: {
      bg: "bg-indigo-50",
      activeCard: "bg-indigo-700",
      mainIcon: lesson.emoji,
      title: "宇宙小观察",
      visualType: "space",
      states: [
        {
          name: "观察",
          step: "轨道运动",
          message: "第 1 步：先看谁在转动或移动，宇宙里很多变化都和轨道有关。",
          iconAnimation: { y: [0, -6, 0], rotate: [0, 12, 0], scale: 1 },
        },
        {
          name: "变化",
          step: "光线变化",
          message: "第 2 步：再看光从哪里来，亮的一面和暗的一面会让样子不同。",
          iconAnimation: { y: [0, -8, 0], rotate: [-6, 6, -6], scale: [1, 1.1, 1] },
        },
        {
          name: "解释",
          step: "位置关系",
          message: "第 3 步：最后把太阳、地球和星球的位置连起来，试着解释看到的现象。",
          iconAnimation: { y: [0, -4, 0], rotate: [0, 10, -10, 0], scale: 1.05 },
        },
      ],
    },
    earth: {
      bg: "bg-sky-50",
      activeCard: "bg-sky-600",
      mainIcon: lesson.emoji,
      title: "自然现象观察",
      visualType: "earth",
      states: [
        {
          name: "观察",
          step: "水的变化",
          message: "第 1 步：先看水在哪里，它可能变成雨滴、云、冰或水汽。",
          iconAnimation: { y: [0, -9, 0], rotate: 0, scale: 1 },
        },
        {
          name: "变化",
          step: "空气流动",
          message: "第 2 步：再想空气怎样移动，风、云和声音都可能跟空气有关。",
          iconAnimation: { y: [0, -8, 0], rotate: [-4, 4, -4], scale: [1, 1.1, 1] },
        },
        {
          name: "解释",
          step: "温度影响",
          message: "第 3 步：最后看温度变高或变低，会不会让自然现象跟着改变。",
          iconAnimation: { y: [0, -5, 0], rotate: [0, 7, -7, 0], scale: 1.05 },
        },
      ],
    },
    music: {
      bg: "bg-pink-50",
      activeCard: "bg-pink-600",
      mainIcon: lesson.emoji,
      title: "声音振动实验",
      visualType: "music",
      states: [
        {
          name: "观察",
          step: "先有振动",
          message: "第 1 步：先找振动在哪里，声音常常是从轻轻颤动开始的。",
          iconAnimation: { y: [0, -6, 0], rotate: [-8, 8, -8], scale: 1 },
        },
        {
          name: "变化",
          step: "声波传开",
          message: "第 2 步：再想声音怎样像波纹一样向外传开，经过空气来到我们这里。",
          iconAnimation: { y: [0, -9, 0], rotate: [-10, 10, -10], scale: [1, 1.12, 1] },
        },
        {
          name: "解释",
          step: "耳朵听见",
          message: "第 3 步：最后把振动和耳朵连起来，解释为什么我们能听见声音。",
          iconAnimation: { y: [0, -4, 0], rotate: [0, 6, -6, 0], scale: 1.06 },
        },
      ],
    },
    body: {
      bg: "bg-rose-50",
      activeCard: "bg-rose-600",
      mainIcon: lesson.emoji,
      title: "身体小侦探",
      visualType: "body",
      states: [
        {
          name: "观察",
          step: "认识器官",
          message: "第 1 步：先认识身体里的一个小帮手，它可能是心脏、大脑、牙齿或皮肤。",
          iconAnimation: { y: [0, -7, 0], rotate: 0, scale: 1 },
        },
        {
          name: "变化",
          step: "感受信号",
          message: "第 2 步：再想身体给了什么感觉信号，比如跳动、冷热、味道或困意。",
          iconAnimation: { y: [0, -10, 0], rotate: [-5, 5, -5], scale: [1, 1.1, 1] },
        },
        {
          name: "解释",
          step: "保护身体",
          message: "第 3 步：最后想一想怎样照顾它，让身体更安全、更舒服。",
          iconAnimation: { y: [0, -4, 0], rotate: [0, 7, -7, 0], scale: 1.05 },
        },
      ],
    },
    science: {
      bg: "bg-purple-50",
      activeCard: "bg-purple-700",
      mainIcon: lesson.emoji,
      title: "科学小实验",
      visualType: "science",
      states: [
        {
          name: "观察",
          step: "先猜一猜",
          message: "第 1 步：先大胆猜一猜结果，科学观察常常从一个问题开始。",
          iconAnimation: { y: [0, -8, 0], rotate: [-3, 3, -3], scale: 1 },
        },
        {
          name: "变化",
          step: "动手测试",
          message: "第 2 步：再看测试中发生了什么，注意只比较一个明显变化。",
          iconAnimation: { y: [0, -11, 0], rotate: [-6, 6, -6], scale: [1, 1.12, 1] },
        },
        {
          name: "解释",
          step: "说出原因",
          message: "第 3 步：最后用自己的话说原因，猜想和结果一样或不一样都很有价值。",
          iconAnimation: { y: [0, -4, 0], rotate: [0, 8, -8, 0], scale: 1.05 },
        },
      ],
    },
    life: {
      bg: "bg-yellow-50",
      activeCard: "bg-amber-600",
      mainIcon: lesson.emoji,
      title: "生活里的科学",
      visualType: "life",
      states: [
        {
          name: "观察",
          step: "发现问题",
          message: "第 1 步：先发现生活里的小问题，比如为什么能清洁、保鲜、挡雨或移动。",
          iconAnimation: { y: [0, -7, 0], rotate: 0, scale: 1 },
        },
        {
          name: "变化",
          step: "观察过程",
          message: "第 2 步：再看它工作时发生了什么，过程里常常藏着科学原理。",
          iconAnimation: { y: [0, -10, 0], rotate: [-5, 5, -5], scale: [1, 1.1, 1] },
        },
        {
          name: "解释",
          step: "安全使用",
          message: "第 3 步：最后想想怎样安全、正确地使用它，让生活更方便。",
          iconAnimation: { y: [0, -4, 0], rotate: [0, 7, -7, 0], scale: 1.05 },
        },
      ],
    },
  };

  const template = templates[lesson.category] || {
    bg: "bg-slate-50",
    activeCard: "bg-slate-900",
    mainIcon: "🔍",
    title: "小小观察",
    visualType: "default",
    states: [
      {
        name: "观察",
        step: "看一看",
        message: "第 1 步：先看一看这个现象最明显的地方。",
        iconAnimation: { y: [0, -8, 0], rotate: 0, scale: 1 },
      },
      {
        name: "变化",
        step: "想一想",
        message: "第 2 步：再想一想它正在发生什么变化。",
        iconAnimation: { y: [0, -12, 0], rotate: [-6, 6, -6], scale: [1, 1.12, 1] },
      },
      {
        name: "解释",
        step: "说一说",
        message: "第 3 步：最后试着用自己的话解释原因。",
        iconAnimation: { y: [0, -4, 0], rotate: [0, 8, -8, 0], scale: 1.05 },
      },
    ],
  };

  const interactionStates = template.states;
  const currentState = interactionStates[activeStep];

  return (
    <div className={`min-h-48 rounded-2xl p-6 ${template.bg}`}>
      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="切换观察步骤"
            onClick={() => setActiveStep((step) => (step + 1) % interactionStates.length)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveStep((step) => (step + 1) % interactionStates.length);
              }
            }}
            whileTap={{ scale: 0.9 }}
            animate={currentState.iconAnimation}
            transition={{ repeat: Infinity, duration: activeStep === 1 ? 1.5 : 2.2 }}
            className="cursor-pointer text-7xl"
          >
            {template.mainIcon}
          </motion.div>

          <CategoryVisual type={template.visualType} activeStep={activeStep} />

          <div className="mt-3 rounded-full bg-white/80 px-4 py-2 text-sm font-bold shadow-sm">
            点击进入下一步：{interactionStates[(activeStep + 1) % interactionStates.length].name}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black">{template.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {currentState.message}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {interactionStates.map((state, index) => {
              const isActive = activeStep === index;

              return (
                <motion.div
                  key={state.step}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-2xl p-4 text-center shadow-sm transition ${
                    isActive ? `${template.activeCard} text-white ring-4 ring-white/70` : "bg-white text-slate-800"
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      isActive ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-sm font-bold">{state.step}</div>
                  <div className={`mt-1 text-xs font-semibold ${isActive ? "text-white/75" : "text-slate-400"}`}>
                    {state.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryVisual({ type, activeStep }) {
  const activeClass = "scale-110 bg-slate-900 text-white shadow-md";
  const quietClass = "bg-white/80 text-slate-500";

  if (type === "animals") {
    return (
      <div className="mt-4 flex gap-2 rounded-full bg-white/60 p-2">
        {["🐾", "🏷️", "🛡️"].map((item, index) => (
          <motion.div
            key={item}
            animate={{ y: activeStep === index ? -4 : 0 }}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
              activeStep === index ? activeClass : quietClass
            }`}
          >
            {item}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "plants") {
    return (
      <div className="mt-4 w-36 rounded-2xl bg-white/70 p-3">
        <div className="flex items-center justify-between text-lg">
          <span>☀️</span>
          <motion.span animate={{ y: activeStep === 1 ? [0, 4, 0] : 0 }} transition={{ repeat: activeStep === 1 ? Infinity : 0, duration: 1.2 }}>
            💧
          </motion.span>
          <span>🌱</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-green-100">
          <motion.div
            animate={{ width: `${34 + activeStep * 33}%` }}
            className="h-full rounded-full bg-green-500"
          />
        </div>
      </div>
    );
  }

  if (type === "space") {
    return (
      <div className="relative mt-4 h-20 w-36 rounded-2xl bg-white/70">
        <div className="absolute left-1/2 top-1/2 h-14 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-200" />
        <div className="absolute left-1/2 top-1/2 text-lg -translate-x-1/2 -translate-y-1/2">☀️</div>
        {[
          "left-4 top-8",
          "left-16 top-2",
          "right-4 top-8",
        ].map((position, index) => (
          <motion.div
            key={position}
            animate={{ scale: activeStep === index ? 1.25 : 1 }}
            className={`absolute ${position} h-4 w-4 rounded-full ${
              activeStep === index ? "bg-indigo-600" : "bg-indigo-200"
            }`}
          />
        ))}
      </div>
    );
  }

  if (type === "earth") {
    return (
      <div className="mt-4 flex gap-2 rounded-2xl bg-white/70 p-2">
        {["💧", "💨", "🌡️"].map((item, index) => (
          <motion.div
            key={item}
            animate={{ y: activeStep === index ? [0, -5, 0] : 0 }}
            transition={{ repeat: activeStep === index ? Infinity : 0, duration: 1.3 }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition ${
              activeStep === index ? activeClass : quietClass
            }`}
          >
            {item}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "music") {
    return (
      <div className="mt-4 flex h-16 w-36 items-center justify-center gap-2 rounded-2xl bg-white/70">
        {[0, 1, 2, 3, 4].map((item) => (
          <motion.div
            key={item}
            animate={{ height: activeStep === 0 ? [18, 38, 18] : activeStep === 1 ? [12, 30, 12] : 18 }}
            transition={{ repeat: Infinity, duration: 0.9, delay: item * 0.08 }}
            className={`w-2 rounded-full ${activeStep === 2 ? "bg-pink-300" : "bg-pink-500"}`}
          />
        ))}
        <span className={`text-xl ${activeStep === 2 ? "scale-110" : ""}`}>👂</span>
      </div>
    );
  }

  if (type === "body") {
    return (
      <div className="mt-4 flex h-16 w-40 items-center gap-1 rounded-2xl bg-white/70 px-3">
        <span className="mr-1 text-lg">❤️</span>
        {[12, 22, 10, 34, 10, 24, 12].map((height, index) => (
          <motion.div
            key={`${height}-${index}`}
            animate={{ height: activeStep === 1 ? [height, height + 10, height] : height }}
            transition={{ repeat: activeStep === 1 ? Infinity : 0, duration: 0.9, delay: index * 0.05 }}
            className={`w-2 rounded-full ${activeStep === 2 ? "bg-rose-300" : "bg-rose-500"}`}
          />
        ))}
        <span className="ml-1 text-lg">{activeStep === 2 ? "🛡️" : "😊"}</span>
      </div>
    );
  }

  if (type === "science") {
    return (
      <div className="mt-4 grid w-40 grid-cols-3 gap-2">
        {["猜", "试", "因"].map((item, index) => (
          <motion.div
            key={item}
            animate={{ y: activeStep === index ? -5 : 0 }}
            className={`rounded-xl px-2 py-3 text-center text-sm font-black transition ${
              activeStep === index ? activeClass : quietClass
            }`}
          >
            {item}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "life") {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/70 p-2 text-sm font-black">
        {["问", "做", "安"].map((item, index) => (
          <Fragment key={item}>
            <motion.div
              animate={{ scale: activeStep === index ? 1.12 : 1 }}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                activeStep === index ? activeClass : quietClass
              }`}
            >
              {item}
            </motion.div>
            {index < 2 && <span className="text-amber-500">→</span>}
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 flex gap-2 rounded-full bg-white/70 p-2">
      {["看", "想", "说"].map((item, index) => (
        <div
          key={item}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
            activeStep === index ? activeClass : quietClass
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function StringLine({ label, width, active, onClick }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-600">{label}</div>
      <button type="button" onClick={onClick} className="block w-full rounded-full py-2 text-left">
        <motion.div
          whileTap={{ scaleY: 1.8 }}
          animate={{ scaleY: active ? [1, 1.6, 1] : 1, x: active ? [0, 3, -3, 0] : 0 }}
          transition={{ repeat: active ? Infinity : 0, duration: 0.9 }}
          className={`${width} h-2 rounded-full ${active ? "bg-pink-600 shadow-[0_0_16px_rgba(219,39,119,0.35)]" : "bg-slate-800"}`}
        />
      </button>
    </div>
  );
}

function MobileNavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold ${
        active ? "bg-slate-900 text-white" : "text-slate-500"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
