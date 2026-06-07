import { useState } from "react";
import { motion } from "framer-motion";

const leafHeights = [
  {
    label: "低树叶",
    height: 42,
    neck: 58,
    message: "低处的叶子，很多动物都比较容易够到。",
  },
  {
    label: "高树叶",
    height: 18,
    neck: 92,
    message: "树叶升高后，长颈鹿的长脖子就派上用场了。",
  },
  {
    label: "看更远",
    height: 26,
    neck: 104,
    message: "站得高、脖子长，也能帮助它更早看到远处变化。",
  },
];

export default function GiraffeNeckDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = leafHeights[activeStep];

  return (
    <div className="min-h-56 overflow-hidden rounded-2xl bg-orange-50 p-5">
      <div className="relative mx-auto h-44 max-w-md rounded-[1.5rem] bg-gradient-to-b from-sky-100 to-green-100 shadow-inner">
        <motion.div
          animate={{ top: currentStep.height }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
          className="absolute right-12 flex flex-col items-center"
        >
          <div className="rounded-full bg-green-600 px-4 py-2 text-2xl shadow-sm">🌿</div>
          <div className="h-24 w-3 rounded-full bg-amber-700" />
        </motion.div>

        <div className="absolute bottom-5 left-14 flex items-end">
          <div className="text-6xl">🦒</div>
          <motion.div
            animate={{ height: currentStep.neck }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            className="relative mb-9 -ml-5 w-6 rounded-full bg-yellow-300 shadow-[inset_0_0_0_3px_rgba(146,64,14,0.18)]"
          >
            <span className="absolute -right-9 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-black text-orange-700 shadow-sm">
              长脖子
            </span>
          </motion.div>
          <motion.div
            animate={{ y: activeStep === 2 ? [-2, -10, -2] : 0 }}
            transition={{ repeat: activeStep === 2 ? Infinity : 0, duration: 1.6 }}
            className="mb-24 -ml-2 h-7 w-7 rounded-full bg-yellow-300 shadow-[inset_0_0_0_3px_rgba(146,64,14,0.18)]"
          >
            <span className="sr-only">长颈鹿头部位置</span>
          </motion.div>
        </div>

        <motion.div
          animate={{ width: activeStep === 0 ? "36%" : activeStep === 1 ? "70%" : "90%" }}
          className="absolute bottom-3 left-5 h-2 rounded-full bg-orange-500"
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {leafHeights.map((step, index) => (
          <button
            key={step.label}
            type="button"
            aria-pressed={activeStep === index}
            onClick={() => setActiveStep(index)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 ${
              activeStep === index ? "bg-orange-600 text-white" : "bg-white text-orange-700 shadow-sm"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 text-center text-sm font-semibold leading-6 text-orange-800">
        {currentStep.message}
      </p>
    </div>
  );
}
