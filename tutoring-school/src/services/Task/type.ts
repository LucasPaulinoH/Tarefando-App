export interface Task {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  images: string[];
  deadlineDate: Date;
  concluded: boolean;
}
