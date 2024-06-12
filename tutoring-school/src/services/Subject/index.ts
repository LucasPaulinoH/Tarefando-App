import axios from "axios";
import { API_BASE_URL } from "../api";
import { Subject } from "./type";

const CONTROLLER_URL = `${API_BASE_URL}/subjects`;

const subjectApi = {
  createSubject: (name: string): Promise<Subject> =>
    axios.post(`${CONTROLLER_URL}`, { name }).then((response) => response.data),
  getSubject: (id: string): Promise<Subject> =>
    axios.get(`${CONTROLLER_URL}/${id}`).then((response) => response.data),
  getAllSubjects: (): Promise<Subject[]> =>
    axios.get(`${CONTROLLER_URL}`).then((response) => response.data),
};

export default subjectApi;
