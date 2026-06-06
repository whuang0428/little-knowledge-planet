import { motion } from "framer-motion";

export default function PenguinFeetDemo() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-sky-50 p-6">
      <div className="flex items-end gap-8">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-7xl"
        >
          🐧
        </motion.div>

        <div className="space-y-2">
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            身体：厚羽毛保暖
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            脚：减少热量流失
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            群体：挤在一起取暖
          </div>
        </div>
      </div>

      <div className="mt-5 h-3 w-full max-w-md rounded-full bg-sky-200">
        <motion.div
          animate={{ width: ["25%", "70%", "25%"] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="h-full rounded-full bg-slate-800"
        />
      </div>

      <p className="mt-3 text-sm text-slate-500">
        黑色条表示热量流动：企鹅会尽量减少热量从脚上跑走。
      </p>
    </div>
  );
}
