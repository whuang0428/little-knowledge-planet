import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SunflowerDemo() {
  const sunX = useMotionValue(0);
  const [sunSide, setSunSide] = useState("right");
  const flowerRotate = useTransform(sunX, [-220, 20], [-18, 14]);
  const flowerX = useTransform(sunX, [-220, 20], [-10, 8]);
  const beamRotate = useTransform(sunX, [-220, 20], [-16, 8]);
  const beamScale = useTransform(sunX, [-220, 20], [0.58, 1]);

  function moveSun(nextSide) {
    setSunSide(nextSide);
    sunX.set(nextSide === "left" ? -220 : 0);
  }

  return (
    <div className="relative flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl bg-green-50 p-5 sm:min-h-48 sm:p-6">
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-green-100/80 to-transparent" />

      <div className="relative flex min-h-36 items-center justify-between">
        <motion.div
          style={{ rotate: beamRotate, scaleX: beamScale }}
          className="pointer-events-none absolute left-24 right-24 top-16 h-3 origin-right rounded-full bg-yellow-200/70 blur-sm sm:top-20"
        />
        <motion.div
          style={{ rotate: beamRotate, scaleX: beamScale }}
          className="pointer-events-none absolute left-28 right-28 top-20 h-1.5 origin-right rounded-full bg-amber-300/60 sm:top-24"
        />

        <motion.div
          style={{ rotate: flowerRotate, x: flowerX, transformOrigin: "50% 100%" }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="relative z-10 text-7xl"
        >
          🌻
        </motion.div>

        <motion.div
          role="img"
          aria-label="可拖动的太阳"
          drag="x"
          dragConstraints={{ left: -220, right: 20 }}
          dragElastic={0.08}
          style={{ x: sunX }}
          whileDrag={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onDragEnd={() => setSunSide(sunX.get() < -100 ? "left" : "right")}
          className="relative z-10 cursor-grab text-7xl active:cursor-grabbing"
        >
          ☀️
        </motion.div>
      </div>

      <div className="relative z-10 mt-3 flex justify-center gap-2">
        {[
          { label: "左边", value: "left" },
          { label: "右边", value: "right" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={sunSide === item.value}
            onClick={() => moveSun(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 ${
              sunSide === item.value ? "bg-green-700 text-white" : "bg-white/85 text-green-700 shadow-sm"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="relative z-10 mt-3 text-center text-sm text-green-700">
        左右移动太阳：向日葵会跟着光的方向转过去。
      </p>
    </div>
  );
}
