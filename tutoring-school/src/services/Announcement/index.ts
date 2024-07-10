import axios from "axios";
import { API_BASE_URL } from "../api";
import { Announcement } from "./type";

const CONTROLLER_URL = `${API_BASE_URL}/announcements`;

const announcementApi = {
  createAnnouncement: (newAnnouncement: Announcement): Promise<Announcement> =>
    axios
      .post(`${CONTROLLER_URL}`, newAnnouncement)
      .then((response) => response.data),
  getAnnouncement: (id: string): Promise<Announcement> =>
    axios.get(`${CONTROLLER_URL}/${id}`).then((response) => response.data),
  getAnnouncementsFromUser: (tutorId: string): Promise<Announcement[]> =>
    axios
      .get(`${CONTROLLER_URL}/search?tutorId=${tutorId}`)
      .then((response) => response.data),
  updateAnnouncement: (
    announcementId: string,
    updatedAnnouncement: Announcement
  ): Promise<Announcement> =>
    axios
      .put(`${CONTROLLER_URL}/${announcementId}`, updatedAnnouncement)
      .then((response) => response.data),

  deleteAnnouncement: (announcementId: string): Promise<void> =>
    axios
      .delete(`${CONTROLLER_URL}/${announcementId}`)
      .then((response) => response.data),
};

export default announcementApi;
