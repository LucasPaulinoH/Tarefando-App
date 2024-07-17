import { Task } from "../Task/type";
import { User } from "../User/type";

export interface Student {
  id?: string;
  userId?: string;
  user: User;
  schoolId?: string;
  name: string;
  birthdate: Date;
  grade: string;
  tasks?: Task[];
}
