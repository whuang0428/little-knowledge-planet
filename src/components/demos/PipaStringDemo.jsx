import { useState } from "react";
import { motion } from "framer-motion";

function StringLine({ label, width, active, onClick }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-600">{label}</div>
      <button type="button" onClick={onClick} className="block w-full rounded-full py-2 text-left">
        <motion.div
          whileTap={{ scaleY: 1.8 }}
          animate={{ scaleY: active ? [1, 1.6, 1] : 1, x: active ? [0, 3, -3, 0] : 0 }}
          transition={{ repeat: active ? Infinity : 0, duration: 0.9 }}
          className={`${width} h-2 rounded-full ${active ? "bg-pink-600 shadow-[0_0_16px_rgba(219,39,119,0.35)]" : "bg-slate-800"}`}
        />
      </button>
    </div>
  );
}

export default function PipaStringDemo() {
  const [activeString, setActiveString] = useState("long");
  const isLong = activeString === "long";

  return (
    <div className="min-h-40 rounded-2xl bg-pink-50 p-6">
      <div className="space-y-5">
        <StringLine
          label="长弦：声音比较低"
          width="w-full"
          active={isLong}
          onClick={() => setActiveString("long")}
        />
        <StringLine
          label="短弦：声音比较高"
          width="w-1/2"
          active={!isLong}
          onClick={() => setActiveString("short")}
        />
      </div>
      <p className="mt-5 text-sm text-slate-500">
        {isLong ? "现在选中长弦：它振动得比较慢，声音通常比较低。" : "现在选中短弦：它振动得更快，声音通常比较高。"}
      </p>
    </div>
  );
}
