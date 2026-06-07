import { useState } from "react";
import { motion } from "framer-motion";

export default function RainbowDemo() {
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
          aria-label="切换白光分色"
          aria-pressed={splitLight}
          onClick={() => setSplitLight((value) => !value)}
          whileTap={{ scale: 0.9 }}
          animate={{ y: splitLight ? [0, -4, 0] : 0 }}
          transition={{ repeat: splitLight ? Infinity : 0, duration: 1.8 }}
          className="cursor-pointer rounded-full bg-white/70 p-2 text-7xl shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
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

      <p aria-live="polite" className="mt-4 text-center text-sm leading-6 text-slate-500">
        {splitLight
          ? "看，白光穿过水滴后分成了红、橙、黄、绿、蓝、靛、紫。再点水滴可以合回去。"
          : "点击水滴，让这束白光分成不同颜色。"}
      </p>
    </div>
  );
}
