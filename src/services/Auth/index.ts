import axios from "axios";
import { API_BASE_URL } from "../api";

const CONTROLLER_URL = `${API_BASE_URL}/auth`;

const authApi = {
  login: (email: string, password: string) => {
    console.log(`${CONTROLLER_URL}/login`);

    return axios
      .post(`${CONTROLLER_URL}/login`, { email, password })
      .then((response) => response.data);
  },
  register: (userData: object) =>
    axios
      .post(`${CONTROLLER_URL}/register`, userData)
      .then((response) => response.data),
};

export default authApi;
