import { api } from "./axios";

export const createStudent = (data) =>
  api.post("/students", data).then((r) => r.data);
export const listStudents = (params) =>
  api.get("/students", { params }).then((r) => r.data);
