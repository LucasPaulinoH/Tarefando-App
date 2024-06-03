import axios from "axios";
import { School } from "./type";
import { API_BASE_URL } from "../api";

const SUB_URL = "schools";

const schoolApi = {
  createSchool: (newSchool: School): Promise<School> =>
    axios
      .post(`${API_BASE_URL}/${SUB_URL}`, newSchool)
      .then((response) => response.data),
  getSchoolsFromTutor: (tutorId: string): Promise<School[]> =>
    axios
      .get(`${API_BASE_URL}/${SUB_URL}/search?tutorId=${tutorId}`)
      .then((response) => response.data),
  deleteSchool: (schoolId: string): Promise<void> =>
    axios
      .delete(`${API_BASE_URL}/${SUB_URL}/${schoolId}`)
      .then((response) => response.data),
};

export default schoolApi;
