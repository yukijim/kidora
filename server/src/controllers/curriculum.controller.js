import { memoryStore } from '../db/store.js';

export function getSubjects(req, res) {
  res.json({
    success: true,
    subjects: memoryStore.subjects,
  });
}

export function getLessons(req, res) {
  const { age, subjectId } = req.query;

  let lessons = memoryStore.lessons;

  if (age && age !== 'all') {
    lessons = lessons.filter((l) => l.ageGroup === Number(age));
  }

  if (subjectId && subjectId !== 'all') {
    lessons = lessons.filter((l) => l.subjectId === subjectId);
  }

  res.json({
    success: true,
    count: lessons.length,
    lessons,
  });
}

export function getLessonById(req, res) {
  const { id } = req.params;
  const lesson = memoryStore.lessons.find((l) => l.id === id);

  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }

  res.json({ success: true, lesson });
}
