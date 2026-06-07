import { categories } from "../src/data/categories.js";
import { lessons } from "../src/data/lessons.js";

const ALLOWED_AGE_RANGES = ["5-7岁", "6-8岁", "7-9岁", "8-10岁"];

const requiredFields = [
  "id",
  "category",
  "title",
  "emoji",
  "readingTime",
  "ageRange",
  "level",
  "intro",
  "content",
  "interaction",
  "quiz",
  "parentPrompt",
  "parentGuide",
  "badge",
  "question",
  "discovery",
  "funFact",
  "tags",
  "relatedLessons",
];

const requiredStringFields = requiredFields.filter(
  (field) => !["quiz", "tags", "relatedLessons", "parentGuide"].includes(field),
);

const errors = [];

const describeLesson = (lesson, index) => {
  const id = typeof lesson?.id === "string" && lesson.id.trim() ? lesson.id : null;
  const title = typeof lesson?.title === "string" && lesson.title.trim() ? lesson.title : null;

  if (id && title) {
    return `${id} (${title})`;
  }

  return id || title || `lesson #${index + 1}`;
};

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const addError = (message) => {
  errors.push(message);
};

if (!Array.isArray(lessons)) {
  addError("lessons.js must export lessons as an array.");
}

if (!Array.isArray(categories)) {
  addError("categories.js must export categories as an array.");
}

const lessonList = Array.isArray(lessons) ? lessons : [];
const categoryList = Array.isArray(categories) ? categories : [];
const categoryIds = new Set(
  categoryList.filter((category) => isNonEmptyString(category?.id)).map((category) => category.id),
);
const lessonIds = new Set();
const duplicateIds = new Set();

lessonList.forEach((lesson, index) => {
  const label = describeLesson(lesson, index);

  if (!("id" in lesson)) {
    addError(`${label}: missing required field "id".`);
    return;
  }

  if (!isNonEmptyString(lesson.id)) {
    addError(`${label}: "id" must be a non-empty string.`);
    return;
  }

  if (lessonIds.has(lesson.id)) {
    duplicateIds.add(lesson.id);
    addError(`${label}: duplicate lesson id "${lesson.id}".`);
  }

  lessonIds.add(lesson.id);
});

lessonList.forEach((lesson, index) => {
  const label = describeLesson(lesson, index);

  for (const field of requiredFields) {
    if (!(field in lesson)) {
      addError(`${label}: missing required field "${field}".`);
    }
  }

  for (const field of requiredStringFields) {
    if (field in lesson && !isNonEmptyString(lesson[field])) {
      addError(`${label}: "${field}" must be a non-empty string.`);
    }
  }

  if ("category" in lesson && isNonEmptyString(lesson.category) && !categoryIds.has(lesson.category)) {
    addError(`${label}: category "${lesson.category}" does not exist in categories.js.`);
  }

  if (
    "ageRange" in lesson &&
    isNonEmptyString(lesson.ageRange) &&
    !ALLOWED_AGE_RANGES.includes(lesson.ageRange)
  ) {
    addError(`${label}: ageRange "${lesson.ageRange}" must be one of: ${ALLOWED_AGE_RANGES.join(", ")}.`);
  }

  if (!isPlainObject(lesson.parentGuide)) {
    addError(`${label}: "parentGuide" must be an object.`);
  } else {
    for (const field of ["talkAbout", "tryThis", "safety"]) {
      if (!(field in lesson.parentGuide)) {
        addError(`${label}: parentGuide missing required field "${field}".`);
      } else if (!isNonEmptyString(lesson.parentGuide[field])) {
        addError(`${label}: parentGuide "${field}" must be a non-empty string.`);
      }
    }
  }

  if (!Array.isArray(lesson.quiz)) {
    addError(`${label}: "quiz" must be an array.`);
  } else {
    if (lesson.quiz.length !== 3) {
      addError(`${label}: "quiz" must contain exactly 3 questions, found ${lesson.quiz.length}.`);
    }

    lesson.quiz.forEach((quizItem, quizIndex) => {
      const quizLabel = `${label} quiz #${quizIndex + 1}`;

      for (const field of ["question", "options", "answer", "explanation"]) {
        if (!(field in quizItem)) {
          addError(`${quizLabel}: missing required field "${field}".`);
        }
      }

      if ("question" in quizItem && !isNonEmptyString(quizItem.question)) {
        addError(`${quizLabel}: "question" must be a non-empty string.`);
      }

      if (!Array.isArray(quizItem.options)) {
        addError(`${quizLabel}: "options" must be an array.`);
      } else {
        if (quizItem.options.length < 2) {
          addError(`${quizLabel}: "options" must contain at least 2 options.`);
        }

        quizItem.options.forEach((option, optionIndex) => {
          if (!isNonEmptyString(option)) {
            addError(`${quizLabel}: option #${optionIndex + 1} must be a non-empty string.`);
          }
        });

        if (
          "answer" in quizItem &&
          (!Number.isInteger(quizItem.answer) ||
            quizItem.answer < 0 ||
            quizItem.answer >= quizItem.options.length)
        ) {
          addError(`${quizLabel}: "answer" must be a valid option index.`);
        }
      }

      if ("explanation" in quizItem && !isNonEmptyString(quizItem.explanation)) {
        addError(`${quizLabel}: "explanation" must be a non-empty string.`);
      }
    });
  }

  if (!Array.isArray(lesson.tags)) {
    addError(`${label}: "tags" must be an array.`);
  } else {
    if (lesson.tags.length < 3 || lesson.tags.length > 6) {
      addError(`${label}: "tags" must contain 3-6 tags, found ${lesson.tags.length}.`);
    }

    const tags = new Set();
    lesson.tags.forEach((tag, tagIndex) => {
      if (!isNonEmptyString(tag)) {
        addError(`${label}: tag #${tagIndex + 1} must be a non-empty string.`);
        return;
      }

      if (tags.has(tag)) {
        addError(`${label}: duplicate tag "${tag}".`);
      }

      tags.add(tag);
    });
  }

  if (!Array.isArray(lesson.relatedLessons)) {
    addError(`${label}: "relatedLessons" must be an array.`);
  } else {
    if (lesson.relatedLessons.length < 2 || lesson.relatedLessons.length > 3) {
      addError(
        `${label}: "relatedLessons" must contain 2-3 lesson ids, found ${lesson.relatedLessons.length}.`,
      );
    }

    const relatedIds = new Set();
    lesson.relatedLessons.forEach((relatedId, relatedIndex) => {
      if (!isNonEmptyString(relatedId)) {
        addError(`${label}: related lesson #${relatedIndex + 1} must be a non-empty string.`);
        return;
      }

      if (relatedId === lesson.id) {
        addError(`${label}: related lesson "${relatedId}" must not reference itself.`);
      }

      if (relatedIds.has(relatedId)) {
        addError(`${label}: duplicate related lesson id "${relatedId}".`);
      }

      if (!lessonIds.has(relatedId)) {
        addError(`${label}: related lesson "${relatedId}" does not exist in lessons.js.`);
      }

      relatedIds.add(relatedId);
    });
  }
});

if (duplicateIds.size > 0) {
  addError(`Duplicate lesson ids found: ${[...duplicateIds].join(", ")}.`);
}

if (errors.length > 0) {
  console.error("Lesson data validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("✅ Lesson data validation passed.");
}
