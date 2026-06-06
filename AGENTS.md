# AGENTS.md

## 项目概览

`little-knowledge-planet` 是一个面向儿童的“小小百科星球”React 原型。`README.md` 仍是默认 Vite 模板说明，真实项目语义以 `src/App.jsx`、`src/data/lessons.js` 和 `src/data/categories.js` 为准。

应用当前包含：

- 首页：强化 hero、今日推荐探索、继续探索、进度条、徽章入口、分类入口。
- 主题库：分类筛选、关键词搜索、结果数量、空搜索状态、课程标签展示。
- 课程页：标题、分类/时长/难度、今天的问题、简单解释、互动 demo、我发现了什么、趣味小知识、三题测验、亲子讨论、完成奖励、继续发现相关推荐。
- 徽章页：显示所有课程徽章和完成状态。
- 本地进度：完成课程 id 存在 `localStorage.completedLessons`。不要改这个 key。

## 技术栈

- React 19 + JavaScript/JSX，没有 TypeScript。
- Vite 8，`vite.config.js` 配置 GitHub Pages base：`/little-knowledge-planet/`。
- Tailwind CSS 4，通过 `@tailwindcss/vite` 接入，无单独 Tailwind config。
- Framer Motion 用于动画和拖拽。
- Lucide React 用于 UI 图标。
- ESLint flat config 在 `eslint.config.js`。

## 关键文件

- `src/App.jsx`：主 UI、所有 view 状态、课程打开逻辑、搜索、答题、完成奖励、互动 demo、相关推荐。
- `src/data/lessons.js`：40 个课程的内容数据。
- `src/data/categories.js`：分类数据，包含 `all` 和 8 个业务分类。
- `src/main.jsx`：React 挂载入口。
- `src/index.css`：只导入 Tailwind。
- `src/App.css`：残留模板样式，当前不是核心样式来源。
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

- `ceb6f9c Add related lesson recommendations`
- `b998a0f Add lesson search and tags`
- `ae09107 Improve lesson page learning structure`
- `210554e Improve quiz feedback and lesson rewards`
- `b953e18 Improve home page exploration experience`

如果新对话开始时 `AGENTS.md` 仍有未提交改动，先检查它是否来自本交接文档更新，不要误判为用户业务代码改动。

## 课程数据结构

`src/data/lessons.js` 中每个 lesson 当前应包含：

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

- 共有 40 个课程。
- 每个 `quiz` 必须正好 3 题。
- 每个 quiz item 包含 `question`、`options`、`answer`、`explanation`。
- `answer` 是 `options` 下标。
- 每个 lesson 的 `tags` 为 3-6 个短中文标签。
- 每个 lesson 的 `relatedLessons` 为 2-3 个有效 lesson id。
- `relatedLessons` 不得包含当前 lesson 自己，不得重复，不得使用不存在的 id。
- 不要重命名现有 lesson id 或 category id。

可用数据校验命令：

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
node --input-type=module -e "import { lessons } from './src/data/lessons.js'; const ids = new Set(lessons.map(l => l.id)); const problems = []; for (const l of lessons) { for (const k of ['question','discovery','funFact','tags','relatedLessons']) if (!l[k]) problems.push(l.id + ':' + k); if (l.quiz.length !== 3) problems.push(l.id + ':quiz'); if (!Array.isArray(l.tags) || l.tags.length < 3 || l.tags.length > 6) problems.push(l.id + ':tags'); if (!Array.isArray(l.relatedLessons) || l.relatedLessons.length < 2 || l.relatedLessons.length > 3) problems.push(l.id + ':related-count'); else { if (l.relatedLessons.includes(l.id)) problems.push(l.id + ':related-self'); if (new Set(l.relatedLessons).size !== l.relatedLessons.length) problems.push(l.id + ':related-dupe'); for (const id of l.relatedLessons) if (!ids.has(id)) problems.push(l.id + ':related-missing:' + id); } } console.log(JSON.stringify({ lessons: lessons.length, problems }, null, 2));"
```

## App 状态和行为

`ChildrenKnowledgeExplorerPrototype` 在 `src/App.jsx` 中维护：

- `selectedCategory`
- `activeLesson`
- `view`: `home`、`library`、`lesson`、`badges`
- `searchQuery`
- `selectedAnswers`
- `completed`
- `moonPhase`
- `showReflection`
- `rewardStatus`

关键行为：

- `openLesson(lesson)` 会重置 quiz 答案、奖励状态并进入 `lesson` view。
- `selectQuizAnswer(index, optionIndex)` 会即时显示正误反馈和解释。
- 三题全对时自动调用完成逻辑，保存到 `localStorage.completedLessons`。
- 已完成课程再次答对时显示“你已经获得过这个徽章啦”语义。
- 移动端底部导航仍使用 `home`、`library`、`badges` 三个入口。

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

相关卡片组件为 `RelatedLessonCard`，不要引入路由，点击直接调用 `openLesson(lesson)`。

## 互动规则

“动一动，看一看”区域必须有真实可见反馈。

- 文案写“点击”，点击后必须有可见变化。
- 文案写“拖动”，拖动后必须有可见变化。
- 不要让文案描述变化，但 UI 静止。
- 特殊课程优先修改 `InteractiveDemo` 中对应 `lesson.id` 分支。
- 普通课程优先修改 `CategoryExploreDemo` 或 `CategoryVisual`。

当前特殊 demo：

- `cat-eyes`
- `penguin-feet`
- `sunflower`
- `moon-shape`
- `rainbow`
- `pipa-string`

其他课程走 `CategoryExploreDemo`。

`SimpleExploreDemo` 是未接线的旧静态 demo，为避免 lint 问题当前有注释保留。除非明确做清理任务，否则不要围绕它新增功能。

## 样式和 UX 约定

- 保持柔和、圆角、儿童友好的视觉风格。
- 主要样式写在 JSX 的 Tailwind class 中。
- 继续使用现有卡片半径、浅色背景、轻阴影。
- 使用 Lucide React 图标，不新增图标库。
- 动画/拖拽继续用 Framer Motion，不新增动画库。
- 移动端和桌面端都要检查按钮、卡片、quiz 选项、标签 pill 不溢出。
- 不要拆分 `App.jsx`，除非用户明确要求重构。
- 不要引入 React Router 或全局状态库。

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
npm.cmd run build
npm.cmd run lint
npm.cmd run preview
```

说明：

- Vite dev server 是长运行进程。
- 默认本地地址通常是 `http://127.0.0.1:5173/`。
- 本环境此前浏览器插件拒绝访问 localhost，手动浏览器 QA 可能需要用户自己执行。

## 验证清单

修改代码后至少运行：

```powershell
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

## 提交前检查

```powershell
git status
git diff
npm.cmd run build
npm.cmd run lint
```

只在 build 和 lint 都通过后 commit。提交后运行：

```powershell
git status
git log --oneline -1
git branch --show-current
```

最终回复应包含：

- changed files
- build/lint 结果
- commit hash
- 当前分支
- 用户手动 push 命令
- 未提交但有意排除的文件
