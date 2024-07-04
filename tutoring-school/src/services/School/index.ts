import axios from "axios";
import { School } from "./type";
import { API_BASE_URL } from "../api";

const CONTROLLER_URL = `${API_BASE_URL}/schools`;

const schoolApi = {
  createSchool: (newSchool: School): Promise<School> =>
    axios
      .post(`${CONTROLLER_URL}`, newSchool)
      .then((response) => response.data),
  getSchool: (id: string): Promise<School> =>
    axios.get(`${CONTROLLER_URL}/${id}`).then((response) => response.data),
  getSchoolsFromTutor: (tutorId: string): Promise<School[]> =>
    axios
      .get(`${CONTROLLER_URL}/search?tutorId=${tutorId}`)
      .then((response) => response.data),
  updateSchool: (schoolId: string, updatedSchool: School): Promise<School> =>
    axios
      .put(`${CONTROLLER_URL}/${schoolId}`, updatedSchool)
      .then((response) => response.data),
  updateSchoolProfileImage: (id: string, url: string) =>
    axios
      .patch(`${CONTROLLER_URL}/profile-image`, { id, url })
      .then((response) => response.data),
  deleteSchool: (schoolId: string): Promise<void> =>
    axios
      .delete(`${CONTROLLER_URL}/${schoolId}`)
      .then((response) => response.data),
};

export default schoolApi;
