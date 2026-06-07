# 小小百科星球

面向儿童的“小小百科星球”百科探索网站。项目用轻量的 React 单页应用展示动物、植物、宇宙、地球、音乐、人体、科学和生活常识课程，让孩子从一个可观察的问题出发，通过短阅读、互动演示、三题小测验和徽章奖励完成一次探索。

## 项目概览

- 主要应用逻辑在 `src/App.jsx`。
- 课程内容数据在 `src/data/lessons.js`。
- 分类数据在 `src/data/categories.js`。
- 课程数据校验脚本在 `scripts/validateLessons.mjs`。
- 页面部署目标是 GitHub Pages，Vite base 配置为 `/little-knowledge-planet/`。

## 主要功能

- 首页：今日推荐、继续探索、学习进度、徽章入口和分类入口。
- 主题库：按分类筛选课程，支持关键词搜索和标签展示。
- 课程页：问题引入、简明解释、互动观察、发现总结、趣味小知识和亲子讨论。
- Quiz：每课 3 道题，答题后显示正误反馈和解释。
- 完成奖励：三题全对后记录完成状态，并显示课程徽章。
- 相关推荐：课程底部提供 2-3 个继续探索方向。
- 本地进度：完成课程 id 存储在 `localStorage.completedLessons`。

## 技术栈

- React 19
- JavaScript / JSX
- Vite 8
- Tailwind CSS 4，通过 `@tailwindcss/vite` 接入
- Framer Motion，用于动画和拖拽
- Lucide React，用于 UI 图标
- ESLint flat config

## 项目结构

```text
.
├─ .github/workflows/deploy.yml   GitHub Pages 部署流程
├─ docs/                          项目维护文档
├─ public/                        静态资源
├─ scripts/validateLessons.mjs    课程数据校验脚本
├─ src/App.jsx                    主界面与交互逻辑
├─ src/data/categories.js         分类数据
├─ src/data/lessons.js            课程内容数据
├─ src/main.jsx                   React 入口
├─ src/index.css                  Tailwind 入口
└─ vite.config.js                 Vite 配置
```

不要编辑或提交 `node_modules`、`dist`、临时文件、日志或生成产物。

## 本地运行

安装依赖：

```powershell
npm.cmd install
```

启动开发服务器：

```powershell
npm.cmd run dev
```

跨平台环境也可以使用：

```bash
npm install
npm run dev
```

## 校验课程数据

修改 `src/data/lessons.js` 或 `src/data/categories.js` 后，先运行课程数据校验：

```powershell
npm.cmd run validate:lessons
```

校验会检查 lesson id、分类引用、必填字段、ageRange、quiz、parentGuide、tags 和 relatedLessons。更多内容维护规则见 [课程内容维护指南](docs/lesson-authoring-guide.md)。

课程内容改动后的完整检查流程：

```powershell
npm.cmd run validate:lessons
npm.cmd run build
npm.cmd run lint
```

## 构建

```powershell
npm.cmd run build
```

构建产物输出到 `dist/`，不要把 `dist/` 作为普通开发改动提交。

## Lint

```powershell
npm.cmd run lint
```

提交前至少确保 lesson validation、build 和 lint 都通过。

## 部署

项目包含 `.github/workflows/deploy.yml`。当 `main` 分支被 push 到 GitHub 后，GitHub Actions 会：

1. 安装依赖。
2. 运行 `npm run build`。
3. 上传 `dist/`。
4. 部署到 GitHub Pages。

本地任务完成后只创建 commit，不要自动 push。需要发布时由维护者手动执行：

```powershell
git push origin HEAD
```

## 内容编辑说明

- 添加或编辑课程时，只改 `src/data/lessons.js` 中必要的 lesson 对象。
- 分类 id 来自 `src/data/categories.js`，不要随意重命名已有 lesson id 或 category id。
- 每个 lesson 必须包含 `id`、`category`、`title`、`emoji`、`readingTime`、`ageRange`、`level`、`intro`、`content`、`interaction`、`quiz`、`parentPrompt`、`parentGuide`、`badge`、`question`、`discovery`、`funFact`、`tags`、`relatedLessons`。
- `ageRange` 使用 `5-7岁`、`6-8岁`、`7-9岁`、`8-10岁` 之一，只作为家长选课参考。
- `parentGuide` 必须包含 `talkAbout`、`tryThis`、`safety` 三个简短中文字段，活动建议必须安全、日常、适合家长陪同。
- 每课 quiz 必须正好 3 题，每题包含 `question`、`options`、`answer`、`explanation`。
- `tags` 使用 3-6 个短中文标签，同一课内不要重复。
- `relatedLessons` 使用 2-3 个已存在 lesson id，不要引用自己。
- 儿童内容要短句、清楚、温和，从可见现象讲到简单原因，不鼓励危险实验。

详细规则和示例见 [课程内容维护指南](docs/lesson-authoring-guide.md)。

## 后续开发规则

- 不引入新库，除非任务明确要求且确有必要。
- 不做大重构，不拆分 `App.jsx`，除非任务明确要求。
- 不改变 `localStorage.completedLessons` 这个进度 key。
- 不改 `node_modules`、`dist` 或生成产物。
- 保持儿童友好的视觉和文案风格。
- 修改 app 行为时，要确认首页、主题库、课程页、quiz、完成奖励、徽章和相关推荐仍然正常。
- 每次提交前运行：

```powershell
npm.cmd run validate:lessons
npm.cmd run build
npm.cmd run lint
```
