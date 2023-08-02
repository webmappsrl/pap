import Stroke from 'ol/style/Stroke';

export interface User {
  addresses?:any[]
  created_at: string;
  email: string;
  email_verified_at: string;
  id: number;
  location: any;
  name: string;
  updated_at: string;
  user_type_id: number;
  zone_id: number;
}
