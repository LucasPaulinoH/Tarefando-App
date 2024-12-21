export interface Announcement {
  id?: string;
  userId: string;
  receiverIds: string[];
  title: string;
  description: string;
  images?: string[];
}

export interface ReceivedAnnouncementDTO {
  title: string;
  description: string;
  images?: string[];
  authorId: string;
}
