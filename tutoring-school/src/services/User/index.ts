import axios from "axios";
import { User } from "./type";
import { API_BASE_URL } from "../api";

const SUB_URL = "users";

const userApi = {
  getUser: (id: string): Promise<User> =>
    axios
      .get(`${API_BASE_URL}/${SUB_URL}/${id}`)
      .then((response) => response.data),
};

export default userApi;
