# AGENTS.md

本文件是给后续 AI 代理和维护者看的项目协作说明。开始任何任务前，先读本文件、`README.md` 和与任务相关的源码文件；涉及课程内容时还要读 `docs/lesson-authoring-guide.md`。

## 项目概览

`little-knowledge-planet` 是一个面向儿童的“小小百科星球”React 单页应用。它通过短阅读、互动演示、三题测验、亲子讨论和徽章奖励，帮助孩子从生活中可观察的问题出发探索百科知识。

当前项目根目录：

```bash
/Users/kw/Projects/little-knowledge-planet
```

GitHub Pages 部署使用 Vite base：

```js
"/little-knowledge-planet/"
```

## 技术栈

- React 19 + JavaScript/JSX，没有 TypeScript。
- Vite 8。
- Tailwind CSS 4，通过 `@tailwindcss/vite` 接入，无单独 Tailwind config。
- Framer Motion 用于动画、拖拽和互动 demo。
- Lucide React 用于 UI 图标。
- ESLint flat config 在 `eslint.config.js`。

除非用户明确要求且确有必要，不要新增 React Router、全局状态库、UI 框架、动画库或数据管理库。

## 关键文件

- `src/App.jsx`：主 UI、页面状态、分类/搜索/筛选、课程打开逻辑、答题、完成奖励、进度存储、相关推荐。
- `src/components/LessonCard.jsx`：课程卡片，包含普通卡片和 `variant="related"` 相关课程卡片。
- `src/components/ProgressSummary.jsx`：首页探索进度面板。
- `src/components/demos/InteractiveDemo.jsx`：按 lesson id 分发特殊互动 demo；其他课程走通用分类 demo。
- `src/components/demos/*.jsx`：互动 demo 组件。
- `src/data/lessons.js`：课程内容数据。
- `src/data/categories.js`：分类数据，包含 `all` 和业务分类。
- `scripts/validateLessons.mjs`：课程数据校验脚本。
- `docs/lesson-authoring-guide.md`：课程创作和维护规则。
- `README.md`：项目说明、命令、部署和维护说明。
- `.github/workflows/deploy.yml`：GitHub Pages 部署流程。

不要编辑或提交 `node_modules`、`dist`、临时缓存、日志或生成产物。

## 常用命令

在项目根目录运行：

```bash
npm install
npm run dev -- --host 127.0.0.1
npm run validate:lessons
npm run build
npm run lint
npm run preview
```

说明：

- Vite dev server 是长运行进程。
- 开发地址通常是 `http://127.0.0.1:5173/little-knowledge-planet/`。
- 如果 npm 访问官方 registry 失败，可先确认网络/DNS/代理；在中国大陆环境可以考虑临时使用镜像源。
- 如果只是修改文档，通常不需要运行 build/lint；如果修改源码或课程数据，必须运行对应验证。

## 验证规则

修改课程数据后必须运行：

```bash
npm run validate:lessons
npm run build
npm run lint
```

修改 React 组件、样式或交互后至少运行：

```bash
npm run build
npm run lint
```

涉及课程页、互动 demo、quiz、进度或推荐逻辑时，还要手动检查相关页面行为：

- 首页推荐、继续探索、进度和徽章入口。
- 主题库分类、年龄/难度/完成状态筛选和关键词搜索。
- 搜索空状态。
- 课程页内容、互动区、quiz 正误反馈和解释。
- 三题全对后的完成奖励。
- 徽章/进度更新。
- “继续发现”不推荐当前课程，点击能打开新课程。
- 移动端底部导航可用，按钮和标签不溢出。

## 课程数据规则

新增或修改课程前，先读 `docs/lesson-authoring-guide.md`。

每个 lesson 必须包含：

```text
id
category
title
emoji
readingTime
ageRange
level
intro
content
interaction
quiz
parentPrompt
parentGuide
badge
question
discovery
funFact
tags
relatedLessons
```

数据约束：

- `id` 必须唯一、非空、稳定，使用英文短横线格式；不要随意重命名已有 id。
- `category` 必须来自 `src/data/categories.js`，课程不要使用 `all`。
- `ageRange` 只能使用 `5-7岁`、`6-8岁`、`7-9岁`、`8-10岁`。
- `parentGuide` 必须包含 `talkAbout`、`tryThis`、`safety` 三个非空中文字段。
- 每课 `quiz` 必须正好 3 题。
- 每个 quiz item 必须包含 `question`、`options`、`answer`、`explanation`。
- `answer` 是 `options` 的数字下标，从 `0` 开始。
- `tags` 为 3-6 个短中文标签，同一课内不得重复。
- `relatedLessons` 为 2-3 个有效 lesson id，不得包含自己、重复项或不存在的 id。

内容风格：

- 儿童友好，短句，温和，聚焦一个核心问题。
- 从看得见的现象讲到简单原因。
- 不吓唬、不评判、不制造焦虑。
- 不鼓励孩子独自接触电、火、化学品、尖锐工具、交通、深水、野生动物或未知植物。
- 亲子活动必须安全、日常、适合家长陪同。

## 分类与搜索

业务分类 id：

```text
animals
plants
space
earth
music
body
science
life
```

`all` 只用于 UI 筛选，不作为课程分类。

主题库搜索会匹配课程标题、引导、分类、标签、问题、发现和趣味知识。处理标签时保持容错，例如使用 `lesson.tags || []`，避免旧数据或异常数据导致页面崩溃。

## 相关推荐

课程页底部有“继续发现”区域。推荐逻辑应保持这些原则：

1. 优先使用 `activeLesson.relatedLessons`。
2. 过滤无效 id、当前课程 id 和重复项。
3. 不足 3 个时补同分类课程。
4. 再不足时补未完成课程。
5. 如果都完成了，仍从其他课程补足用于复习。
6. 最多显示 3 个。

相关课程卡片由 `LessonCard` 的 `variant="related"` 支持。不要为了相关推荐引入路由；点击应直接调用现有课程打开逻辑。

## 互动 Demo

“动一动，看一看”区域必须有真实可见反馈。文案写“点击”就要点击后有变化；文案写“拖动”就要拖动后有变化。

当前特殊 demo 分发：

- `cat-eyes` -> `CatEyesDemo`
- `penguin-feet` -> `PenguinFeetDemo`
- `sunflower` -> `SunflowerDemo`
- `moon-shape` -> `MoonShapeDemo`
- `rainbow` -> `RainbowDemo`
- `pipa-string` -> `PipaStringDemo`

其他课程走 `CategoryExploreDemo` 通用分类互动。不要新增特殊 demo，除非任务明确要求或现有通用 demo 无法满足内容表达。

## 本地进度存储

新版 key：

```js
"littleKnowledgePlanet.progress"
```

当前结构：

```js
{
  version: 1,
  completedLessons: [],
  lastVisitedLessonId: null,
  lessonStats: {}
}
```

`lessonStats` 可包含：

- `completedAt`
- `lastVisitedAt`
- `bestScore`

旧 key：

```js
"completedLessons"
```

兼容规则：

- 加载时优先读 `littleKnowledgePlanet.progress`。
- 新 key 缺失或不可用时，从旧 key `completedLessons` 迁移有效 lesson id。
- 保存新版 progress 时，同步写入旧 key 的 completed lesson id 数组。
- 不要删除旧 key 兼容。
- localStorage 不可用、JSON 损坏或 id 失效时，应用必须继续工作。

## 样式和 UX 约定

- 保持柔和、明亮、儿童友好的视觉风格。
- 主要样式写在 JSX 的 Tailwind class 中。
- 继续使用现有卡片、浅色背景、轻阴影和圆角体系。
- 使用 Lucide React 图标，不新增图标库。
- 动画和拖拽继续使用 Framer Motion。
- 移动端和桌面端都要检查按钮、卡片、quiz 选项、标签 pill 不溢出。
- 不要做大重构；除非任务明确要求，否则保持改动聚焦。

## Git 工作流

- 默认只做本地修改，不要自动 push。
- 提交前运行适合改动范围的验证命令。
- 只 stage 当前任务实际修改的文件。
- 不要提交 `node_modules`、`dist`、缓存目录、日志或临时文件。
- 如果工作区已有与当前任务无关的改动，不要回滚；先判断是否需要避开或与用户确认。

提交前建议检查：

```bash
git status --short
git diff
npm run validate:lessons
npm run build
npm run lint
```

需要发布时，由维护者手动执行：

```bash
git push origin HEAD
```

