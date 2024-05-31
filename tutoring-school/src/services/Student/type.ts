import { Task } from "../Task/type";

export interface Student {
  id: string;
  guardianId: string;
  schoolId?: string;
  name: string;
  birthdate: string;
  grade: string;
  tasks: Task[]
}
