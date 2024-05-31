import axios from "axios";
import { School } from "./type";
import { API_BASE_URL } from "../api";

const SUB_URL = "schools";

const schoolApi = {
  getSchoolsFromTutor: (tutorId: string): Promise<School[]> =>
    axios
      .get(`${API_BASE_URL}/${SUB_URL}/search?tutorId=${tutorId}`)
      .then((response) => response.data),
};

export default schoolApi;
