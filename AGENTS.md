# AGENTS.md

This file is for AI coding agents and maintainers working in this repository. Read it before editing, then read `README.md` and the source or docs relevant to the current task.

## Project

`little-knowledge-planet` is a child-friendly React single-page learning app. It presents short encyclopedia-style lessons with interactive demos, three-question quizzes, parent prompts, local progress, and badge rewards.

Local path:

```bash
/Users/kw/Projects/little-knowledge-planet
```

GitHub Pages base path:

```js
"/little-knowledge-planet/"
```

## Stack

- React 19 with JavaScript/JSX.
- Vite 8.
- Tailwind CSS 4 through `@tailwindcss/vite`.
- Framer Motion for animation, drag, and interactive demos.
- Lucide React for icons.
- ESLint flat config in `eslint.config.js`.

Do not add React Router, a global state library, a UI framework, or another animation/data library unless the user explicitly asks and the need is real.

## Important Files

- `src/App.jsx`: main UI, page state, filtering/search, lesson opening, quiz, completion, progress, and related lessons.
- `src/components/LessonCard.jsx`: normal and related lesson cards.
- `src/components/ProgressSummary.jsx`: home progress panel.
- `src/components/demos/InteractiveDemo.jsx`: dispatches special demos by lesson id.
- `src/components/demos/*.jsx`: interactive demo components.
- `src/data/lessons.js`: lesson content.
- `src/data/categories.js`: category metadata.
- `scripts/validateLessons.mjs`: lesson data validator.
- `docs/lesson-authoring-guide.md`: lesson authoring rules.
- `.github/workflows/deploy.yml`: GitHub Pages deployment.

Do not edit or commit `node_modules`, `dist`, temporary caches, logs, or generated output.

## Commands

Run commands from the project root:

```bash
npm install
npm run dev -- --host 127.0.0.1
npm run validate:lessons
npm run build
npm run lint
npm run preview
```

The dev server is usually available at:

```text
http://127.0.0.1:5173/little-knowledge-planet/
```

If npm registry access fails, check network, DNS, or proxy settings before changing dependencies.

## Verification

For lesson data changes, run:

```bash
npm run validate:lessons
npm run build
npm run lint
```

For React, style, or interaction changes, run at least:

```bash
npm run build
npm run lint
```

Manually check affected flows when touching lessons, demos, quiz logic, progress, completion, recommendations, or navigation:

- Home recommendations, continue card, progress, and badge entry.
- Topic library category, age, difficulty, completion filters, and keyword search.
- Empty search state.
- Lesson page content, demo, quiz feedback, and explanations.
- Completion reward after all three quiz answers are correct.
- Progress and badge updates.
- Related lessons do not include the current lesson and can be opened.
- Mobile bottom navigation and button labels do not overflow.

## Lesson Data Rules

Read `docs/lesson-authoring-guide.md` before adding or changing lessons.

Each lesson must include:

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

Rules:

- `id` must be unique, stable, non-empty, and use lowercase kebab-case.
- `category` must exist in `src/data/categories.js`; lessons must not use `all`.
- `ageRange` must be one of `5-7岁`, `6-8岁`, `7-9岁`, `8-10岁`.
- `parentGuide` must include non-empty `talkAbout`, `tryThis`, and `safety` fields.
- `quiz` must contain exactly 3 questions.
- Each quiz item must include `question`, `options`, `answer`, and `explanation`.
- `answer` is a zero-based index into `options`.
- `tags` should contain 3-6 short Chinese tags with no duplicates in the same lesson.
- `relatedLessons` should contain 2-3 valid lesson ids, with no self-reference and no duplicates.

Content style:

- Write short, warm, child-friendly Chinese.
- Start from something observable, then explain the simple reason.
- Keep one clear idea per lesson.
- Do not frighten, judge, or create anxiety.
- Do not encourage children to handle electricity, fire, chemicals, sharp tools, traffic, deep water, unknown plants, or unsafe animals.
- Parent-child activities must be safe, everyday, and suitable for adult supervision.

## Interaction Rules

The "动一动，看一看" area must give visible feedback. If the text says click, clicking must change something; if it says drag, dragging must visibly affect the demo.

Current special demo dispatch:

- `cat-eyes` -> `CatEyesDemo`
- `penguin-feet` -> `PenguinFeetDemo`
- `sunflower` -> `SunflowerDemo`
- `moon-shape` -> `MoonShapeDemo`
- `rainbow` -> `RainbowDemo`
- `pipa-string` -> `PipaStringDemo`

Other lessons use `CategoryExploreDemo`. Do not add a special demo unless the current task needs one.

## Progress Storage

Current progress key:

```js
"littleKnowledgePlanet.progress"
```

Expected shape:

```js
{
  version: 1,
  completedLessons: [],
  lastVisitedLessonId: null,
  lessonStats: {}
}
```

Keep backward compatibility with the old key when relevant:

```js
"completedLessons"
```

## Working Rules

- Check `git status --short` before editing.
- Preserve user changes; do not revert unrelated work.
- Keep changes scoped to the requested feature or fix.
- Prefer existing patterns and components.
- Do not split or rewrite large files only for style.
- Do not push, publish, or deploy unless the user explicitly asks.
