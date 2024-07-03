import { UserRole } from "../../types/Types";

export interface User {
  id: string;
  name: string;
  profileImage?: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

export interface UserCard {
  userName: string;
  profileImage?: string;
}
