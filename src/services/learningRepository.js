/* ============================================
   KIDORA — Learning Repository Service Layer
   Abstracts Data Access between REST API & Local Fallback
   ============================================ */

import api from './apiClient';
import { SUBJECTS, getAllCurriculumLessons } from '../data/learningCurriculum';

export const learningRepository = {
  // Fetch Subjects
  async getSubjects() {
    try {
      const res = await api.get('/curriculum/subjects');
      if (res.success && res.subjects) return res.subjects;
    } catch (e) {
      // Fallback
    }
    return SUBJECTS;
  },

  // Fetch Lessons (filtered by age/subject)
  async getLessons(age, subjectId) {
    try {
      const query = new URLSearchParams();
      if (age) query.append('age', age);
      if (subjectId) query.append('subjectId', subjectId);

      const res = await api.get(`/curriculum/lessons?${query.toString()}`);
      if (res.success && res.lessons) return res.lessons;
    } catch (e) {
      // Fallback
    }
    const all = getAllCurriculumLessons();
    return all.filter((l) => {
      const matchesAge = !age || age === 'all' || l.ageGroup === Number(age);
      const matchesSub = !subjectId || subjectId === 'all' || l.subjectId === subjectId;
      return matchesAge && matchesSub;
    });
  },

  // Sync complete lesson with Backend
  async completeLesson(childId, lessonId) {
    try {
      const res = await api.post('/progress/complete-lesson', { childId, lessonId });
      if (res.success) return res;
    } catch (e) {
      console.info('[LearningRepository] Operating in offline local-sync mode');
    }
    return null;
  },

  // Sync mission advance with Backend
  async advanceMission(childId, missionId) {
    try {
      const res = await api.post('/progress/advance-mission', { childId, missionId });
      if (res.success) return res;
    } catch (e) {
      console.info('[LearningRepository] Operating in offline local-sync mode');
    }
    return null;
  },
};

export default learningRepository;
