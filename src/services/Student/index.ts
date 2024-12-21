import axios from "axios";
import { API_BASE_URL } from "../api";
import { Student } from "./type";

const CONTROLLER_URL = `${API_BASE_URL}/students`;

const studentApi = {
  createStudent: (newStudent: Student): Promise<Student> =>
    axios
      .post(`${CONTROLLER_URL}`, newStudent)
      .then((response) => response.data),
  getStudent: (id: string): Promise<Student> =>
    axios.get(`${CONTROLLER_URL}/${id}`).then((response) => response.data),
  getStudentsFromGuardian: (guardianId: string): Promise<Student[]> =>
    axios
      .get(`${CONTROLLER_URL}/guardian?userId=${guardianId}`)
      .then((response) => response.data),
  getStudentsFromSchool: (schoolId: string): Promise<Student[]> =>
    axios
      .get(`${CONTROLLER_URL}/school?schoolId=${schoolId}`)
      .then((response) => response.data),
  updateStudent: (
    studentId: string,
    updatedStudent: Student
  ): Promise<Student> =>
    axios
      .put(`${CONTROLLER_URL}/${studentId}`, updatedStudent)
      .then((response) => response.data),
  checkStudentLinkValidity: (studentId: string) =>
    axios
      .post(`${CONTROLLER_URL}/check-student-link/${studentId}`)
      .then((response) => response.data),

  unlinkStudentFromSchool: (studentId: string): Promise<Student> =>
    axios
      .patch(`${CONTROLLER_URL}/unlink-from-school/${studentId}`)
      .then((response) => response.data),
  linkStudentToSchool: (
    studentId: string,
    schoolId: string
  ): Promise<Student> =>
    axios
      .patch(`${CONTROLLER_URL}/link-to-school/${studentId}/${schoolId}`)
      .then((response) => response.data),

  deleteStudent: (studentId: string): Promise<void> =>
    axios
      .delete(`${CONTROLLER_URL}/${studentId}`)
      .then((response) => response.data),
};

export default studentApi;
