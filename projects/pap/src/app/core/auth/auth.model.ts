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
  fiscal_code?: string;
  id: number;
  location: [number, number];
  name: string;
  password: string;
  password_confirmation: string;
  phone_number?: string;
  success: boolean;
  updated_at?: string;
  user_code?: string;
  user_type_id?: number;
  zone_id?: number;
}

export interface Address {
  address: string;
  created_at: string;
  id: number;
  location: [number, number];
  updated_at: string;
  user_id: number;
  user_type_id: number;
  zone_id: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends User {
  address: Address;
  password: string;
  password_confirmation: string;
}

export interface LogoutResponse extends User {
  message: string;
}

export interface ResendEmailResponse {
  data: [];
  message: string;
  success: boolean;
}
