import axios from "axios";
import { User, UserCard } from "./type";
import { API_BASE_URL } from "../api";

const CONTROLLER_URL = `${API_BASE_URL}/users`;

const userApi = {
  getUser: (id: string): Promise<User> =>
    axios.get(`${CONTROLLER_URL}/${id}`).then((response) => response.data),
  getUserCard: (id: string): Promise<UserCard> =>
    axios
      .get(`${CONTROLLER_URL}/user-card/${id}`)
      .then((response) => response.data),
  updateUserProfileImage: (userId: string, url: string) =>
    axios
      .patch(`${CONTROLLER_URL}/profile-image`, { userId, url })
      .then((response) => response.data),
};

export default userApi;
