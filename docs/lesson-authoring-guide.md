# 课程内容维护指南

本文说明如何在 `src/data/lessons.js` 中添加或编辑课程内容。目标是让课程稳定、可搜索、适合儿童阅读，并且不会破坏应用页面、quiz 或相关推荐。

## 编辑位置

- 课程数据：`src/data/lessons.js`
- 分类数据：`src/data/categories.js`
- 数据校验脚本：`scripts/validateLessons.mjs`

添加新课程前，先查看已有课程的写法和可用分类 id。不要重命名已有 lesson id 或 category id，除非明确要同步修改所有引用。

## 必填字段

每个 lesson 必须包含这些字段：

```js
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

其中 `id`、`category`、`title`、`emoji`、`readingTime`、`ageRange`、`level`、`intro`、`content`、`interaction`、`parentPrompt`、`badge`、`question`、`discovery`、`funFact` 都应是非空字符串。`parentGuide` 应是对象。

## 字段说明

- `id`：稳定的英文短横线 id，例如 `cat-eyes`。必须唯一。
- `category`：必须是 `src/data/categories.js` 中已有的业务分类 id，不使用 `all` 作为课程分类。
- `title`：课程标题，通常是一个孩子会问的问题。
- `emoji`：课程代表 emoji。
- `readingTime`：阅读时间，例如 `5分钟`。
- `ageRange`：适合年龄参考，例如 `6-8岁`，只作为家长判断的粗略参考。
- `level`：难度或适读阶段，例如 `小学低年级`。
- `intro`：进入课程前的短引导。
- `content`：核心解释，语言要短、清楚、儿童友好。
- `interaction`：互动区提示，要和实际 UI 行为匹配。
- `quiz`：三题小测验。
- `parentPrompt`：给家长的讨论提示。
- `parentGuide`：给家长的结构化陪伴建议，包含讨论、观察活动和安全提醒。
- `badge`：完成课程后获得的徽章名称。
- `question`：课程页“今天的问题”。
- `discovery`：孩子学完后可以说出的发现。
- `funFact`：轻量、有趣、适合儿童的补充知识。
- `tags`：搜索和主题关联使用的短标签。
- `relatedLessons`：继续探索推荐使用的 lesson id。

## Quiz 要求

每个 lesson 的 `quiz` 必须：

- 正好 3 题。
- 每题包含 `question`、`options`、`answer`、`explanation`。
- `question` 是非空字符串。
- `options` 是数组，至少 2 个选项。
- 每个 option 都是非空字符串。
- `answer` 是 `options` 中正确答案的数字下标，从 `0` 开始。
- `explanation` 是简短、儿童友好的解释。

写 quiz 时不要惩罚孩子答错。错误反馈应该帮助理解，例如“再想想，关键是光被反射回来了”，不要使用羞辱、吓唬或压力式语言。

## Tags 要求

每个 lesson 的 `tags` 必须：

- 包含 3-6 个短中文标签。
- 对搜索有帮助，优先选择主题、对象、现象和关键概念。
- 同一课内不要重复。

示例：

```js
tags: ["动物", "夜晚", "眼睛", "反光", "猫"]
```

## Related Lessons 要求

每个 lesson 的 `relatedLessons` 必须：

- 包含 2-3 个已存在的 lesson id。
- 不引用当前 lesson 自己。
- 不包含重复 id。
- 不使用不存在的 id。

选择相关课程时，可以按这些线索连接：

- 同一主题或分类。
- 相似标签。
- 孩子可能自然产生的下一个问题。
- 从一个现象延伸到另一个现象的好奇路径。

## Parent Guide 要求

每个 lesson 的 `parentGuide` 必须是一个对象，并包含：

- `talkAbout`：一个亲子讨论方向，鼓励先听孩子猜想。
- `tryThis`：一个安全、日常、容易观察的小活动。
- `safety`：一个安全提醒；如果没有特殊风险，也要写温和的通用提醒。

示例：
```js
parentGuide: {
  talkAbout: "可以聊一聊：云为什么会变成雨，先听听孩子自己的猜想。",
  tryThis: "可以在安全的窗边观察云的颜色和形状变化。",
  safety: "下雨或打雷时待在安全室内观察，不去积水或高处。"
}
```

写作规则：
- 每项保持短句，适合家长快速阅读。
- 只建议观察、讨论或安全的日常活动。
- 不鼓励孩子接触电、火、化学品、尖锐工具、交通、深水、野生动物或未知植物。
- 需要户外观察时，要提醒有大人陪伴，并选择安全位置。

## Age Range 要求

每个 lesson 的 `ageRange` 必须使用以下值之一：

```js
"5-7岁"
"6-8岁"
"7-9岁"
"8-10岁"
```

选择建议：
- `5-7岁`：现象直观、生活里容易看到、互动简单。
- `6-8岁`：需要一点比较或因果理解，但仍适合低年级。
- `7-9岁`：概念稍抽象，需要家长一起解释或多看几步。
- `8-10岁`：涉及更复杂的科学关系，只作为拓展探索。

年龄范围是给家长的参考，不是严格规则。孩子如果感兴趣，可以由家长陪同一起阅读和讨论。

## 儿童友好写作规则

- 一课只聚焦一个核心问题。
- 使用短句，避免长段落堆叠。
- 从孩子看得见的现象开始，再解释简单原因。
- 少用成人化、抽象化或过度专业的术语。
- 如果必须使用新词，要马上用简单比喻解释。
- 语气温和，不吓唬、不评判、不制造焦虑。
- 避免血腥、恐怖、危险或不适合儿童独自接触的内容。
- 不鼓励儿童进行危险实验，例如接触火、电、药品、尖锐工具、高处或陌生动物。
- 需要观察或动手时，优先使用安全、日常、可由家长陪同的方式。

## 简短示例

下面是一个缩短后的示例。真实课程可以更完整，但结构应保持一致。

```js
{
  id: "example-rain",
  category: "earth",
  title: "为什么会下雨？",
  emoji: "🌧️",
  readingTime: "5分钟",
  ageRange: "6-8岁",
  level: "小学低年级",
  intro: "天空里的云为什么有时会落下雨点？",
  content: "云里有很多很小的水滴。水滴越聚越多，变重以后就会落下来，形成雨。",
  interaction: "点击云朵，看看小水滴怎样聚在一起。",
  quiz: [
    {
      question: "雨点主要来自哪里？",
      options: ["云里", "石头里", "书包里"],
      answer: 0,
      explanation: "云里有许多小水滴，聚多了会落下来。"
    },
    {
      question: "小水滴为什么会落下？",
      options: ["变多变重了", "想去跳舞", "被星星推了"],
      answer: 0,
      explanation: "水滴变重后，就更容易从云里落下来。"
    },
    {
      question: "观察下雨时应该注意什么？",
      options: ["在安全地方看", "跑到马路中间", "摸电线"],
      answer: 0,
      explanation: "观察天气要站在安全的地方，最好有大人陪同。"
    }
  ],
  parentPrompt: "可以和孩子聊聊：雨后地面和植物有什么变化？",
  parentGuide: {
    talkAbout: "可以聊一聊：云为什么会变成雨，先听听孩子自己的猜想。",
    tryThis: "可以在安全的窗边观察云的颜色和形状变化。",
    safety: "下雨或打雷时待在安全室内观察，不去积水或高处。"
  },
  badge: "小小雨滴观察员",
  question: "为什么云会变成雨？",
  discovery: "原来云里的小水滴变多变重后，就会落下来。",
  funFact: "有时太阳雨会一边下雨一边出太阳。",
  tags: ["地球", "天气", "雨", "云", "水滴"],
  relatedLessons: ["rainbow", "thunder-lightning", "cloud-rain"]
}
```

实际提交前必须确认 `relatedLessons` 中的 id 已存在于 `src/data/lessons.js`。

## 提交前验证

编辑课程数据后必须运行：

```powershell
npm.cmd run validate:lessons
npm.cmd run build
npm.cmd run lint
```

`validate:lessons` 通过后，仍要运行 build 和 lint，确保内容结构没有影响页面渲染或代码质量。
