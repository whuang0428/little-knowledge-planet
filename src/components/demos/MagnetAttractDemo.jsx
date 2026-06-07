import { useState } from "react";
import { motion } from "framer-motion";

const materials = [
  {
    label: "铁回形针",
    icon: "📎",
    attracted: true,
    message: "铁制物品会被磁铁吸引，靠近时会明显移动。",
  },
  {
    label: "纸片",
    icon: "📄",
    attracted: false,
    message: "纸通常不会被普通磁铁吸住，所以它留在原地。",
  },
  {
    label: "木块",
    icon: "🪵",
    attracted: false,
    message: "木头也通常不会被普通磁铁吸住，材料不同结果不同。",
  },
];

export default function MagnetAttractDemo() {
  const [activeMaterial, setActiveMaterial] = useState(0);
  const material = materials[activeMaterial];

  return (
    <div className="min-h-56 rounded-2xl bg-purple-50 p-6">
      <div className="relative mx-auto flex h-36 max-w-md items-center justify-between overflow-hidden rounded-[1.5rem] bg-white px-8 shadow-inner">
        <motion.div
          animate={{ scale: material.attracted ? [1, 1.08, 1] : 1 }}
          transition={{ repeat: material.attracted ? Infinity : 0, duration: 1.3 }}
          className="text-6xl"
        >
          🧲
        </motion.div>

        <motion.div
          animate={{ width: material.attracted ? "44%" : "22%", opacity: material.attracted ? 1 : 0.35 }}
          className="absolute left-24 top-1/2 h-2 -translate-y-1/2 rounded-full bg-purple-300"
        />

        <motion.div
          key={material.label}
          initial={{ x: 0, rotate: 0 }}
          animate={{
            x: material.attracted ? -88 : 0,
            rotate: material.attracted ? [-4, 4, -4] : 0,
          }}
          transition={{ type: "spring", stiffness: 130, damping: 14 }}
          className="z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 text-5xl shadow-sm"
        >
          {material.icon}
        </motion.div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {materials.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={activeMaterial === index}
            onClick={() => setActiveMaterial(index)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200 ${
              activeMaterial === index ? "bg-purple-700 text-white" : "bg-white text-purple-700 shadow-sm"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 text-center text-sm font-semibold leading-6 text-purple-800">
        {material.message}
      </p>
    </div>
  );
}
