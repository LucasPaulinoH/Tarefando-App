export interface School {
  id?: string;
  userId: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  profileImage: string | null;
  cep: string;
  address: string;
  addressNumber: string;
  district: string;
  city: string;
  state: string;
}
