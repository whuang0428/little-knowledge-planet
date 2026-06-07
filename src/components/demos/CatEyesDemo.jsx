import { useState } from "react";
import { motion } from "framer-motion";

export default function CatEyesDemo() {
  const [showReflection, setShowReflection] = useState(false);

  return (
    <div className="relative flex min-h-40 flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-900 p-6 text-white">
      <motion.div
        animate={{ opacity: showReflection ? 1 : 0.25, x: showReflection ? 18 : 0 }}
        className="absolute left-5 top-16 h-2 w-24 rounded-full bg-amber-200/80 blur-sm"
      />
      <motion.button
        type="button"
        aria-label="切换猫眼反光"
        aria-pressed={showReflection}
        onClick={() => setShowReflection((value) => !value)}
        whileTap={{ scale: 0.92 }}
        className="relative flex cursor-pointer gap-6 rounded-full bg-slate-800 px-8 py-6 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
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
      <p aria-live="polite" className="mt-4 text-sm text-slate-300">
        {showReflection ? "光照过来后，猫眼把光反射回来，亮得更明显。" : "点击小猫眼睛，打开一束小光看看反射。"}
      </p>
    </div>
  );
}
