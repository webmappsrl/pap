import {UserType, Zone} from '../../shared/form/location/location.model';

export interface Address {
  address: string;
  created_at: string;
  house_number: any;
  id: number;
  location: string;
  updated_at: string;
  user_id: number;
  user_type: UserType;
  user_type_id: number;
  zone: Zone;
  zone_id: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LogoutResponse extends User {
  message: string;
}

export interface RegisterData extends User {
  address: Address;
  password: string;
  password_confirmation: string;
}

export interface ResendEmailResponse {
  data: [];
  message: string;
  success: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  addresses: Address[];
  app_company_id: number;
  created_at?: string;
  data: {
    token: string;
    name: string;
    email_verified_at: string;
    user: User;
  };
  email: string;
  email_verified_at: string;
  error: {
    message: string;
  };
  fcm_token?: string;
  form_data?: {[key: string]: any};
  id: number;
  location: [number, number];
  name: string;
  password: string;
  password_confirmation: string;
  roles: Role[];
  success: boolean;
  updated_at?: string;
  user_type_id?: number;
  zone_id?: number;
}
