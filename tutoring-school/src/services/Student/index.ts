import axios from "axios";
import { API_BASE_URL } from "../api";
import { Student } from "./type";

const SUB_URL = "students";

const studentApi = {
  getStudentsFromGuardian: (guardianId: string): Promise<Student[]> =>
    axios
      .get(`${API_BASE_URL}/${SUB_URL}/search?guardianId=${guardianId}`)
      .then((response) => response.data),
};

export default studentApi;
