export interface Announcement {
  id?: string;
  tutorId: string;
  receiverIds: string[];
  title: string;
  description: string;
  images: string[];
}
