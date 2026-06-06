import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lessons } from "./data/lessons";
import { categories } from "./data/categories";
import LessonCard from "./components/LessonCard";
import ProgressSummary from "./components/ProgressSummary";
import InteractiveDemo from "./components/demos/InteractiveDemo";
import {
  BookOpen,
  Star,
  Trophy,
  CheckCircle2,
  Home,
  Sparkles,
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

                <ProgressSummary
                  completedCount={completed.length}
                  totalCount={lessons.length}
                  percentage={progressPercent}
                  onReset={resetProgress}
                />
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
                        isCompleted={false}
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
                      isCompleted={completed.includes(lesson.id)}
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
                        {relatedLessonSuggestions.map((lesson) => {
                          const relatedCategory = categories.find((item) => item.id === lesson.category);

                          return (
                            <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              category={relatedCategory}
                              isCompleted={completed.includes(lesson.id)}
                              onOpen={() => openLesson(lesson)}
                              variant="related"
                            />
                          );
                        })}
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
