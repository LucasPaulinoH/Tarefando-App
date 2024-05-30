import { UserRole } from "../../types/Types";

export interface User {
  id: string;
  name: string;
  profileImae?: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}
