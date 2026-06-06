# AGENTS.md

## 项目概览

`little-knowledge-planet` 是一个面向儿童的“小小百科星球”React 单页原型。项目已经不是默认 Vite 模板；当前项目说明在 `README.md`，课程维护规则在 `docs/lesson-authoring-guide.md`。

应用当前包含：

- 首页：hero、今日推荐探索、继续探索、探索进度、徽章入口、分类入口。
- 主题库：分类筛选、关键词搜索、结果数量、空搜索状态、课程标签展示。
- 课程页：标题、分类/时长/难度、今天的问题、简单解释、互动 demo、我发现了什么、趣味小知识、三题测验、亲子讨论、完成奖励、继续发现相关推荐。
- 徽章页：显示所有课程徽章和完成状态。
- 本地进度：新版 key 为 `littleKnowledgePlanet.progress`，旧 key `completedLessons` 仍保留兼容，不要删除或破坏旧 key 迁移。

## 技术栈

- React 19 + JavaScript/JSX，没有 TypeScript。
- Vite 8，`vite.config.js` 配置 GitHub Pages base：`/little-knowledge-planet/`。
- Tailwind CSS 4，通过 `@tailwindcss/vite` 接入，无单独 Tailwind config。
- Framer Motion 用于动画、拖拽和互动 demo。
- Lucide React 用于 UI 图标。
- ESLint flat config 在 `eslint.config.js`。

不要引入 React Router、全局状态库或新依赖，除非用户明确要求且确有必要。

## 关键文件

- `src/App.jsx`：主 UI、所有 view 状态、课程打开逻辑、搜索、答题、完成奖励、进度存储、相关推荐。
- `src/components/LessonCard.jsx`：普通课程卡片和 `variant="related"` 相关课程卡片。
- `src/components/ProgressSummary.jsx`：首页探索进度面板。
- `src/components/demos/InteractiveDemo.jsx`：按 lesson id 分发特殊互动 demo，否则走通用分类 demo。
- `src/components/demos/*.jsx`：已抽出的互动 demo 组件。
- `src/data/lessons.js`：48 个课程的内容数据。
- `src/data/categories.js`：分类数据，包含 `all` 和 8 个业务分类。
- `scripts/validateLessons.mjs`：课程数据校验脚本。
- `docs/lesson-authoring-guide.md`：课程创作和维护规则。
- `README.md`：项目说明、命令、部署和维护说明。
- `.github/workflows/deploy.yml`：GitHub Pages 部署。

不要编辑或提交 `node_modules`、`dist`、临时脚本、日志或生成产物。

## Git 工作流

用户要求：后续任务只负责创建本地 commit，不要 push。

完成任务后：

1. 运行验证。
2. 只 `git add` 本任务实际修改的文件。
3. 创建本地 commit。
4. 最终回复给出 commit hash、当前分支、手动 push 命令。

不要执行 `git push`。给用户的 push 命令格式：

```powershell
cd D:\react-projects\little-knowledge-planet
git push origin HEAD
```

## 当前 Git 状态参考

截至本次交接，最近提交包括：

- `d451d9f Add first batch of encyclopedia lessons`
- `b464b0c Upgrade progress storage model`
- `a4c7c4b Extract interactive demo components`
- `c695447 Extract reusable UI components`
- `9fc2ede Improve project documentation`
- `5a393a6 Add lesson data validation script`
- `9554618 Update agent handoff guide`
- `ceb6f9c Add related lesson recommendations`

如果新对话开始时 `AGENTS.md` 有未提交改动，先确认是否来自交接文档更新，不要误判为业务代码改动。

## 课程数据结构

`src/data/lessons.js` 当前共有 48 个课程。8 个业务分类各 6 个课程：

- `animals`
- `plants`
- `space`
- `earth`
- `music`
- `body`
- `science`
- `life`

最新新增的 8 个课程：

- `turtle-slow`：为什么乌龟走得慢？
- `autumn-leaves`：为什么树叶秋天会变色？
- `sky-blue`：为什么天空是蓝色的？
- `rain-soil-smell`：为什么下雨后会有泥土味？
- `ears-hear-sound`：为什么耳朵能听见声音？
- `brush-teeth-clean`：为什么牙齿要刷干净？
- `soap-bubble-round`：为什么肥皂泡是圆的？
- `clock-hands-turn`：为什么钟表的指针会转？

每个 lesson 必须包含：

- `id`
- `category`
- `title`
- `question`
- `discovery`
- `funFact`
- `tags`
- `relatedLessons`
- `emoji`
- `readingTime`
- `level`
- `intro`
- `content`
- `interaction`
- `quiz`
- `parentPrompt`
- `badge`

数据约束：

- 每个 `id` 是唯一、非空、URL-safe 的字符串。
- `category` 必须来自 `src/data/categories.js`，课程不要使用 `all`。
- 每个 `quiz` 必须正好 3 题。
- 每个 quiz item 包含 `question`、`options`、`answer`、`explanation`。
- `answer` 是 `options` 下标。
- 每个 lesson 的 `tags` 为 3-6 个短中文标签，课内不得重复。
- 每个 lesson 的 `relatedLessons` 为 2-3 个有效 lesson id。
- `relatedLessons` 不得包含当前 lesson 自己，不得重复，不得使用不存在的 id。
- 不要重命名现有 lesson id 或 category id，除非用户明确要求并同步全部引用。

新增或修改课程前先读 `docs/lesson-authoring-guide.md`。课程内容要儿童友好：短句、温和、聚焦一个核心问题，从可见现象讲到简单原因，不鼓励危险实验。

## 数据验证

课程数据校验命令：

```powershell
npm.cmd run validate:lessons
```

该命令会检查：

- lesson id 是否存在、非空、唯一。
- category 是否存在。
- 必填字段是否存在。
- 必填字符串是否非空。
- `quiz` 是否正好 3 题。
- quiz item 的 `question`、`options`、`answer`、`explanation` 是否有效。
- `tags` 是否 3-6 个且无重复。
- `relatedLessons` 是否 2-3 个、有效、无重复、无自引用。

修改课程数据后必须运行：

```powershell
npm.cmd run validate:lessons
npm.cmd run build
npm.cmd run lint
```

## App 状态和行为

`ChildrenKnowledgeExplorerPrototype` 在 `src/App.jsx` 中维护：

- `selectedCategory`
- `activeLesson`
- `view`: `home`、`library`、`lesson`、`badges`
- `searchQuery`
- `selectedAnswers`
- `progress`
- `moonPhase`
- `showReflection`
- `rewardStatus`

关键行为：

- `openLesson(lesson)` 会设置当前课程、记录最近访问、重置 quiz 答案和奖励状态，并进入 `lesson` view。
- `selectQuizAnswer(index, optionIndex)` 会即时显示正误反馈和解释。
- 三题全对时自动调用完成逻辑，显示完成奖励。
- 已完成课程再次答对时显示“你已经获得过这个徽章啦”语义。
- 移动端底部导航仍使用 `home`、`library`、`badges` 三个入口。

## 本地进度存储

新版进度 key：

```js
littleKnowledgePlanet.progress
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
completedLessons
```

兼容规则：

- 加载时优先读 `littleKnowledgePlanet.progress`。
- 新 key 缺失或不可用时，从旧 key `completedLessons` 迁移有效 lesson id。
- 不要删除旧 key。
- 保存新版 progress 时，旧 key 也会同步写入 completed lesson id 数组，用于兼容。
- localStorage 不可用、JSON 损坏、id 失效时，应用必须继续工作。

## 搜索和标签

主题库搜索匹配：

- lesson title
- intro
- category label
- tags
- question
- discovery
- funFact

搜索和分类筛选同时生效。缺少 `tags` 时必须用 `lesson.tags || []`，避免崩溃。

## 相关推荐

课程页底部有“继续发现”区域。

推荐逻辑：

1. 优先使用 `activeLesson.relatedLessons`。
2. 过滤无效 id、当前课程 id、重复项。
3. 不足 3 个时补同分类课程。
4. 再不足时补未完成课程。
5. 如果都完成了，仍从其他课程补足用于复习。
6. 最多显示 3 个。

相关课程卡片现在由 `LessonCard` 的 `variant="related"` 支持。不要引入路由，点击直接调用 `openLesson(lesson)`。

## 互动规则

“动一动，看一看”区域必须有真实可见反馈。

当前特殊 demo：

- `cat-eyes` -> `CatEyesDemo`
- `penguin-feet` -> `PenguinFeetDemo`
- `sunflower` -> `SunflowerDemo`
- `moon-shape` -> `MoonShapeDemo`
- `rainbow` -> `RainbowDemo`
- `pipa-string` -> `PipaStringDemo`

其他课程走 `CategoryExploreDemo` 通用分类互动。

互动 demo 文件在：

```text
src/components/demos/
```

规则：

- 文案写“点击”，点击后必须有可见变化。
- 文案写“拖动”，拖动后必须有可见变化。
- 不要让文案描述变化，但 UI 静止。
- 不要新增 demo 组件，除非用户明确要求。
- `SimpleExploreDemo` 是未接线的旧静态 demo，为避免 lint 问题当前有注释保留。除非明确做清理任务，否则不要围绕它新增功能。

## 样式和 UX 约定

- 保持柔和、圆角、儿童友好的视觉风格。
- 主要样式写在 JSX 的 Tailwind class 中。
- 继续使用现有卡片半径、浅色背景、轻阴影。
- 使用 Lucide React 图标，不新增图标库。
- 动画/拖拽继续用 Framer Motion，不新增动画库。
- 移动端和桌面端都要检查按钮、卡片、quiz 选项、标签 pill 不溢出。
- 不要引入 React Router 或全局状态库。
- 不要做大重构；除非用户明确要求，否则保持改动聚焦。

## 编码注意事项

项目包含大量中文和 emoji，按 UTF-8 处理。

PowerShell 如出现中文乱码，先设置：

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
```

不要基于乱码终端输出修改中文文案。

## 常用命令

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1
npm.cmd run validate:lessons
npm.cmd run build
npm.cmd run lint
npm.cmd run preview
```

说明：

- Vite dev server 是长运行进程。
- 默认本地地址通常是 `http://127.0.0.1:5173/little-knowledge-planet/`。
- 本环境浏览器插件可能拒绝访问 localhost/127.0.0.1。若浏览器自动化被安全策略阻止，不要绕过策略；可用 `npm.cmd run build`、`npm.cmd run lint`、`npm.cmd run validate:lessons` 和 Vite HTTP 200 检查作为替代，并在最终回复中说明限制。

## 验证清单

修改代码或数据后至少运行：

```powershell
npm.cmd run validate:lessons
npm.cmd run build
npm.cmd run lint
```

根据改动范围检查：

- 首页是否正常。
- 主题库分类和搜索是否正常。
- 搜索空状态是否正常。
- 课程页结构卡片是否正常。
- 互动 demo 是否仍有真实反馈。
- quiz 正误反馈和解释是否正常。
- 三题全对后完成奖励是否正常。
- 徽章/进度是否更新。
- “继续发现”相关课程不包含当前课程，点击能打开新课程。
- 移动端底部导航仍可用。
- 新增课程是否可被搜索命中，`tags` 和 `relatedLessons` 是否合理。

## 提交前检查

```powershell
git status
git diff
npm.cmd run validate:lessons
npm.cmd run build
npm.cmd run lint
```

只在 validation、build 和 lint 都通过后 commit。提交后运行：

```powershell
git status
git log --oneline -1
git branch --show-current
```

最终回复应包含：

- changed files
- validation/build/lint 结果
- commit hash
- 当前分支
- 用户手动 push 命令
- 未提交但有意排除的文件或验证限制
