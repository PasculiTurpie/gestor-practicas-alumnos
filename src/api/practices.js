import { api } from "./axios";

export const createPractice = (studentId) =>
  api.post("/practices", { studentId }).then((r) => r.data);
export const listPractices = (params) =>
  api.get("/practices", { params }).then((r) => r.data);
export const advanceStage = (id, payload) =>
  api.patch(`/practices/${id}/advance`, payload).then((r) => r.data);
export const getPracticeByStudent = (studentId) =>
  api.get(`/practices/by-student/${studentId}`).then((r) => r.data);
export const getPracticeStats = (params) =>
  api.get("/practices/stats", { params }).then((r) => r.data);