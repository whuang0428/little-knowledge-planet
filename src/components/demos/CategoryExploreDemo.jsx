import { Fragment, useState } from "react";
import { motion } from "framer-motion";

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
            className="cursor-pointer rounded-full p-2 text-7xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80"
          >
            {template.mainIcon}
          </motion.button>

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
