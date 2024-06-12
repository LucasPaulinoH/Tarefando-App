import axios from "axios";
import { User } from "./type";
import { API_BASE_URL } from "../api";

const CONTROLLER_URL = `${API_BASE_URL}/users`;

const userApi = {
  getUser: (id: string): Promise<User> =>
    axios.get(`${CONTROLLER_URL}/${id}`).then((response) => response.data),
};

export default userApi;
