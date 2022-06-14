import Stroke from 'ol/style/Stroke';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  location: any;
  user_type_id: number;
  zone_id: number;
}
