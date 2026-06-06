import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SunflowerDemo() {
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
