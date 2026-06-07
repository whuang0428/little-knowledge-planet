import { useState } from "react";
import { motion } from "framer-motion";

const visualSteps = {
  animals: [
    { focus: "🐾", helper: "👀", label: "观察身体部分", detail: "脚印、眼睛、耳朵都可能是线索。", color: "orange" },
    { focus: "🦴", helper: "🏃", label: "发现动作变化", detail: "动作变快、变慢或换方向。", color: "amber" },
    { focus: "🛡️", helper: "🍃", label: "连接生存用途", detail: "这个特点怎样帮助它生活？", color: "emerald" },
  ],
  plants: [
    { focus: "☀️", helper: "🌱", label: "找到阳光", detail: "光照亮，叶子开始工作。", color: "yellow" },
    { focus: "💧", helper: "🌿", label: "补充水分", detail: "小水滴让植物更挺立。", color: "sky" },
    { focus: "🌳", helper: "✨", label: "看见长大", detail: "阳光和水一起帮它长高。", color: "green" },
  ],
  space: [
    { focus: "🔭", helper: "✨", label: "抬头观察", detail: "先找亮点和移动方向。", color: "indigo" },
    { focus: "🌓", helper: "☀️", label: "比较明暗", detail: "亮面和暗面会改变样子。", color: "violet" },
    { focus: "🪐", helper: "↻", label: "发现规律", detail: "位置变化会形成重复模式。", color: "blue" },
  ],
  earth: [
    { focus: "💧", helper: "☁️", label: "观察水", detail: "水会变成雨、云、冰或水汽。", color: "sky" },
    { focus: "💨", helper: "🍃", label: "看空气", detail: "空气流动会推动很多变化。", color: "cyan" },
    { focus: "🌡️", helper: "🔥", label: "比较温度", detail: "冷和热会让现象不一样。", color: "rose" },
  ],
  music: [
    { focus: "🎻", helper: "〰️", label: "触碰振动", detail: "先看哪里在轻轻颤动。", color: "pink" },
    { focus: "🎵", helper: ")))", label: "声波传开", detail: "声音像波纹一样向外走。", color: "fuchsia" },
    { focus: "👂", helper: "💗", label: "耳朵听见", detail: "耳朵接住振动带来的信息。", color: "rose" },
  ],
  body: [
    { focus: "🧠", helper: "👀", label: "认识器官", detail: "先找到身体的小帮手。", color: "rose" },
    { focus: "💓", helper: "〰️", label: "感受信号", detail: "跳动、冷热、味道都是信号。", color: "red" },
    { focus: "🛡️", helper: "😊", label: "学会保护", detail: "照顾身体会让它更舒服。", color: "emerald" },
  ],
  science: [
    { focus: "❓", helper: "💭", label: "先猜一猜", detail: "从一个问题开始观察。", color: "purple" },
    { focus: "🧪", helper: "↔", label: "动手比较", detail: "只看一个明显变化。", color: "violet" },
    { focus: "💡", helper: "✅", label: "说出原因", detail: "猜想和结果都能帮助发现。", color: "amber" },
  ],
  life: [
    { focus: "🔎", helper: "?", label: "发现问题", detail: "先看生活里的小现象。", color: "amber" },
    { focus: "⚙️", helper: "↔", label: "观察过程", detail: "它工作时发生了什么？", color: "orange" },
    { focus: "✅", helper: "🧡", label: "安全使用", detail: "知道原理，也要用得安全。", color: "green" },
  ],
  default: [
    { focus: "🔎", helper: "👀", label: "看一看", detail: "先找到最明显的地方。", color: "slate" },
    { focus: "💭", helper: "↔", label: "想一想", detail: "再比较前后的变化。", color: "blue" },
    { focus: "💡", helper: "✅", label: "说一说", detail: "最后试着解释原因。", color: "amber" },
  ],
};

const colorClasses = {
  amber: "bg-amber-500 shadow-amber-200 ring-amber-100",
  blue: "bg-blue-500 shadow-blue-200 ring-blue-100",
  cyan: "bg-cyan-500 shadow-cyan-200 ring-cyan-100",
  emerald: "bg-emerald-500 shadow-emerald-200 ring-emerald-100",
  fuchsia: "bg-fuchsia-500 shadow-fuchsia-200 ring-fuchsia-100",
  green: "bg-green-500 shadow-green-200 ring-green-100",
  indigo: "bg-indigo-500 shadow-indigo-200 ring-indigo-100",
  orange: "bg-orange-500 shadow-orange-200 ring-orange-100",
  pink: "bg-pink-500 shadow-pink-200 ring-pink-100",
  purple: "bg-purple-500 shadow-purple-200 ring-purple-100",
  red: "bg-red-500 shadow-red-200 ring-red-100",
  rose: "bg-rose-500 shadow-rose-200 ring-rose-100",
  sky: "bg-sky-500 shadow-sky-200 ring-sky-100",
  slate: "bg-slate-700 shadow-slate-200 ring-slate-100",
  violet: "bg-violet-500 shadow-violet-200 ring-violet-100",
  yellow: "bg-yellow-400 shadow-yellow-200 ring-yellow-100",
};

function getVisualSteps(type) {
  return visualSteps[type] || visualSteps.default;
}

function CategoryVisual({ type, activeStep, fallbackIcon }) {
  const steps = getVisualSteps(type);
  const currentVisual = steps[activeStep] || steps[0];
  const activeColor = colorClasses[currentVisual.color] || colorClasses.slate;

  return (
    <div className="mt-4 w-full max-w-sm rounded-[1.5rem] bg-white/80 p-4 shadow-sm ring-1 ring-white/80">
      <div className="relative flex min-h-32 items-center justify-center overflow-hidden rounded-2xl bg-white">
        <motion.div
          key={`glow-${activeStep}`}
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{ opacity: 0.95, scale: 1.18 }}
          transition={{ duration: 0.45 }}
          className={`absolute h-28 w-28 rounded-full blur-xl ${activeColor}`}
        />
        <motion.div
          key={`helper-${activeStep}`}
          initial={{ opacity: 0, x: -18, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="absolute left-6 top-5 rounded-full bg-white/85 px-3 py-2 text-2xl shadow-sm"
        >
          {currentVisual.helper}
        </motion.div>
        <motion.div
          key={`focus-${activeStep}`}
          initial={{ y: 16, rotate: -8, scale: 0.75 }}
          animate={{ y: 0, rotate: 0, scale: activeStep === 2 ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative z-10 text-7xl"
        >
          {currentVisual.focus || fallbackIcon}
        </motion.div>
        <motion.div
          key={`label-${activeStep}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-black text-white shadow-sm"
        >
          {currentVisual.label}
        </motion.div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          return (
            <div
              key={step.label}
              className={`rounded-2xl px-2 py-2 text-center text-xs font-black transition ${
                isActive ? `${colorClasses[step.color]} text-white ring-4` : "bg-slate-100 text-slate-500"
              }`}
            >
              {step.label}
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className={`h-full rounded-full ${activeColor}`}
        />
      </div>

      <p aria-live="polite" className="mt-3 text-center text-sm font-semibold leading-6 text-slate-600">
        你正在观察：{currentVisual.detail}
      </p>
    </div>
  );
}

export default function CategoryExploreDemo({ lesson }) {
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
  const visualState = getVisualSteps(template.visualType)[activeStep] || getVisualSteps("default")[0];
  const nextState = interactionStates[(activeStep + 1) % interactionStates.length];

  return (
    <div className={`min-h-48 rounded-2xl p-6 ${template.bg}`}>
      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="flex flex-col items-center justify-center">
          <motion.button
            type="button"
            aria-label="切换观察步骤"
            onClick={() => setActiveStep((step) => (step + 1) % interactionStates.length)}
            whileTap={{ scale: 0.9 }}
            animate={currentState.iconAnimation}
            transition={{ repeat: Infinity, duration: activeStep === 1 ? 1.5 : 2.2 }}
            className="flex cursor-pointer flex-col items-center rounded-[1.75rem] bg-white/90 px-6 py-4 text-center shadow-sm ring-1 ring-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/90"
          >
            <span className="text-6xl">{visualState.focus || template.mainIcon}</span>
            <span className="mt-2 text-xs font-black text-slate-500">点击进入下一步</span>
          </motion.button>

          <CategoryVisual type={template.visualType} activeStep={activeStep} fallbackIcon={template.mainIcon} />

          <div className="mt-3 rounded-full bg-white/85 px-4 py-2 text-sm font-bold shadow-sm">
            下一步：{nextState.name} - {nextState.step}
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
                <motion.button
                  type="button"
                  key={state.step}
                  aria-pressed={isActive}
                  onClick={() => setActiveStep(index)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-2xl p-4 text-center shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80 ${
                    isActive
                      ? `${template.activeCard} text-white ring-4 ring-white/70 scale-[1.03]`
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
