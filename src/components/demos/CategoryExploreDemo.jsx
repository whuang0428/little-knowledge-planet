import { useState } from "react";
import { motion } from "framer-motion";

const categoryStyles = {
  animals: {
    bg: "bg-orange-50",
    activeCard: "bg-orange-600",
    accent: "bg-orange-500 shadow-orange-200 ring-orange-100",
    title: "动物观察时间",
  },
  plants: {
    bg: "bg-green-50",
    activeCard: "bg-green-600",
    accent: "bg-green-500 shadow-green-200 ring-green-100",
    title: "植物观察时间",
  },
  space: {
    bg: "bg-indigo-50",
    activeCard: "bg-indigo-700",
    accent: "bg-indigo-500 shadow-indigo-200 ring-indigo-100",
    title: "宇宙观察时间",
  },
  earth: {
    bg: "bg-sky-50",
    activeCard: "bg-sky-600",
    accent: "bg-sky-500 shadow-sky-200 ring-sky-100",
    title: "自然观察时间",
  },
  music: {
    bg: "bg-pink-50",
    activeCard: "bg-pink-600",
    accent: "bg-pink-500 shadow-pink-200 ring-pink-100",
    title: "声音观察时间",
  },
  body: {
    bg: "bg-rose-50",
    activeCard: "bg-rose-600",
    accent: "bg-rose-500 shadow-rose-200 ring-rose-100",
    title: "身体观察时间",
  },
  science: {
    bg: "bg-purple-50",
    activeCard: "bg-purple-700",
    accent: "bg-purple-500 shadow-purple-200 ring-purple-100",
    title: "科学观察时间",
  },
  life: {
    bg: "bg-yellow-50",
    activeCard: "bg-amber-600",
    accent: "bg-amber-500 shadow-amber-200 ring-amber-100",
    title: "生活观察时间",
  },
  default: {
    bg: "bg-slate-50",
    activeCard: "bg-slate-900",
    accent: "bg-slate-700 shadow-slate-200 ring-slate-100",
    title: "小小观察",
  },
};

const interactionStates = [
  {
    name: "观察",
    step: "看一看",
    message: "第 1 步：先看这节课的问题和画面，找最明显、最容易发现的地方。",
    note: "先把注意力放到这个现象上。",
    progress: "33%",
    spotlight: { scale: 1, opacity: 0.8 },
    marker: { x: -44, y: -26, scale: 0.9 },
    iconAnimation: { y: [0, -8, 0], rotate: 0, scale: 1 },
  },
  {
    name: "比较",
    step: "找变化",
    message: "第 2 步：再比较大小、方向、位置或前后变化，看看哪里和一开始不一样。",
    note: "观察圈会帮你标出变化点。",
    progress: "66%",
    spotlight: { scale: 1.15, opacity: 0.95 },
    marker: { x: 42, y: -4, scale: 1.08 },
    iconAnimation: { y: [0, -12, 0], rotate: [-4, 4, -4], scale: [1, 1.08, 1] },
  },
  {
    name: "解释",
    step: "想原因",
    message: "第 3 步：最后把看到的现象和课程解释连起来，试着说一说为什么会这样。",
    note: "把观察和原因连起来。",
    progress: "100%",
    spotlight: { scale: 1.28, opacity: 1 },
    marker: { x: 0, y: 24, scale: 1.16 },
    iconAnimation: { y: [0, -6, 0], rotate: [0, 6, -6, 0], scale: 1.08 },
  },
];

function LessonAwareVisual({ lesson, activeStep, accent }) {
  const currentState = interactionStates[activeStep];

  return (
    <div className="mt-4 w-full max-w-sm rounded-[1.5rem] bg-white/80 p-4 shadow-sm ring-1 ring-white/80">
      <div className="relative flex min-h-36 items-center justify-center overflow-hidden rounded-2xl bg-white">
        <motion.div
          animate={currentState.spotlight}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
          className={`absolute h-32 w-32 rounded-full blur-xl ${accent}`}
        />

        <motion.div
          animate={currentState.marker}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="absolute z-20 h-16 w-16 rounded-full border-4 border-white/95 bg-white/10 shadow-[0_0_0_6px_rgba(15,23,42,0.08)]"
        >
          <span className="absolute -right-2 -top-3 rounded-full bg-slate-900 px-2 py-0.5 text-xs font-black text-white">
            {activeStep + 1}
          </span>
        </motion.div>

        <motion.div
          animate={currentState.iconAnimation}
          transition={{ repeat: Infinity, duration: activeStep === 1 ? 1.5 : 2.2 }}
          className="relative z-10 text-7xl"
        >
          {lesson.emoji}
        </motion.div>

        <motion.div
          key={currentState.step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 z-30 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-black text-white shadow-sm"
        >
          {currentState.step}
        </motion.div>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: currentState.progress }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className={`h-full rounded-full ${accent}`}
        />
      </div>

      <div aria-live="polite" className="mt-3 rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
        <div className="text-xs font-black text-slate-400">你正在观察</div>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{currentState.note}</p>
        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-400">
          {lesson.question || lesson.title}
        </p>
      </div>
    </div>
  );
}

export default function CategoryExploreDemo({ lesson }) {
  const [activeStep, setActiveStep] = useState(0);
  const style = categoryStyles[lesson.category] || categoryStyles.default;
  const currentState = interactionStates[activeStep];
  const nextState = interactionStates[(activeStep + 1) % interactionStates.length];

  return (
    <div className={`min-h-48 rounded-2xl p-6 ${style.bg}`}>
      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="flex flex-col items-center justify-center">
          <motion.button
            type="button"
            aria-label="切换观察步骤"
            onClick={() => setActiveStep((step) => (step + 1) % interactionStates.length)}
            whileTap={{ scale: 0.9 }}
            className="flex cursor-pointer flex-col items-center rounded-[1.75rem] bg-white/90 px-6 py-4 text-center shadow-sm ring-1 ring-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/90"
          >
            <span className="text-6xl">{lesson.emoji}</span>
            <span className="mt-2 text-xs font-black text-slate-500">点击进入下一步</span>
          </motion.button>

          <LessonAwareVisual lesson={lesson} activeStep={activeStep} accent={style.accent} />

          <div className="mt-3 rounded-full bg-white/85 px-4 py-2 text-sm font-bold shadow-sm">
            下一步：{nextState.name} - {nextState.step}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black">{style.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{currentState.message}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {interactionStates.map((state, index) => {
              const isActive = activeStep === index;

              return (
                <motion.button
                  type="button"
                  key={state.step}
                  aria-pressed={isActive}
                  onClick={() => setActiveStep(index)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-2xl p-4 text-center shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80 ${
                    isActive
                      ? `${style.activeCard} scale-[1.03] text-white ring-4 ring-white/70`
                      : "bg-white text-slate-800 hover:bg-white/90"
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
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
