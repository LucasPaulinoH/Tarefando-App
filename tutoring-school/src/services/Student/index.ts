import axios from "axios";
import { API_BASE_URL } from "../api";
import { Student } from "./type";

const CONTROLLER_URL = `${API_BASE_URL}/students`;

const studentApi = {
  createStudent: (newStudent: Student): Promise<Student> =>
    axios
      .post(`${CONTROLLER_URL}`, newStudent)
      .then((response) => response.data),
  getStudentsFromGuardian: (guardianId: string): Promise<Student[]> =>
    axios
      .get(`${CONTROLLER_URL}/search?guardianId=${guardianId}`)
      .then((response) => response.data),
  updateStudent: (
    studentId: string,
    updatedStudent: Student
  ): Promise<Student> =>
    axios
      .put(`${CONTROLLER_URL}/${studentId}`, updatedStudent)
      .then((response) => response.data),
  deleteStudent: (studentId: string): Promise<void> =>
    axios
      .delete(`${CONTROLLER_URL}/${studentId}`)
      .then((response) => response.data),
};

export default studentApi;
