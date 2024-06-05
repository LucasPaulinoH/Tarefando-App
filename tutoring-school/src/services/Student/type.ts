import { Task } from "../Task/type";

export interface Student {
  id?: string;
  guardianId: string;
  schoolId?: string;
  name: string;
  birthdate: Date;
  grade: string;
  tasks?: Task[]
}
