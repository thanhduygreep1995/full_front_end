import { Role } from "../interfaces/irole";

export interface customerResponse {
    id: number;
    first_name: string;
    last_name: string;
    // date_of_birth: Date;
    email: string;
    phone_number: string;
    address: string;
    facebook_id: string;
    google_id: string;
    role_id: Role;
  
}