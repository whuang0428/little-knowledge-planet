import { useState } from "react";
import { motion } from "framer-motion";

const bubbleSteps = [
  {
    label: "吹进空气",
    scale: 0.74,
    radius: "42% 58% 48% 52%",
    shine: 0.35,
    message: "泡泡薄膜里包进空气，形状还在轻轻晃动。",
  },
  {
    label: "薄膜收紧",
    scale: 0.92,
    radius: "48% 52% 50% 50%",
    shine: 0.65,
    message: "薄膜会像小皮筋一样收紧，形状越来越圆。",
  },
  {
    label: "圆圆泡泡",
    scale: 1.08,
    radius: "9999px",
    shine: 1,
    message: "圆形能用较小的表面包住空气，所以泡泡常常圆圆的。",
  },
];

export default function SoapBubbleDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = bubbleSteps[activeStep];

  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl bg-sky-50 p-6">
      <motion.button
        type="button"
        aria-label="观察肥皂泡变圆"
        onClick={() => setActiveStep((step) => (step + 1) % bubbleSteps.length)}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-36 w-36 items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
      >
        <motion.div
          animate={{
            scale: currentStep.scale,
            borderRadius: currentStep.radius,
          }}
          transition={{ type: "spring", stiffness: 130, damping: 14 }}
          className="absolute inset-4 border-4 border-sky-200 bg-white/40 shadow-[inset_0_0_24px_rgba(14,165,233,0.2),0_0_32px_rgba(56,189,248,0.25)]"
        />
        <motion.div
          animate={{ opacity: currentStep.shine, x: activeStep === 2 ? [0, 5, 0] : 0 }}
          transition={{ repeat: activeStep === 2 ? Infinity : 0, duration: 1.6 }}
          className="absolute left-10 top-10 h-7 w-4 rounded-full bg-white/80 blur-[1px]"
        />
        <span className="relative z-10 text-5xl">🫧</span>
      </motion.button>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {bubbleSteps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            aria-pressed={activeStep === index}
            onClick={() => setActiveStep(index)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 ${
              activeStep === index ? "bg-sky-600 text-white" : "bg-white text-sky-700 shadow-sm"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 max-w-md text-center text-sm font-semibold leading-6 text-sky-800">
        {currentStep.message}
      </p>
    </div>
  );
}
