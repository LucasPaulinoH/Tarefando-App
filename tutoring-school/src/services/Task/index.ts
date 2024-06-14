import { API_BASE_URL } from "../api";
import axios from "axios";
import { Task } from "./type";

const CONTROLLER_URL = `${API_BASE_URL}/tasks`;

const taskApi = {
  createTask: (newTask: Task): Promise<Task> =>
    axios.post(`${CONTROLLER_URL}`, newTask).then((response) => response.data),
  getTask: (id: string): Promise<Task> =>
    axios.get(`${CONTROLLER_URL}/${id}`).then((response) => response.data),
  updateTask: (taskId: string, updatedTask: Task): Promise<Task> =>
    axios
      .put(`${CONTROLLER_URL}/${taskId}`, updatedTask)
      .then((response) => response.data),
  deleteTask: (taskId: string): Promise<void> =>
    axios
      .delete(`${CONTROLLER_URL}/${taskId}`)
      .then((response) => response.data),
};

export default taskApi;
