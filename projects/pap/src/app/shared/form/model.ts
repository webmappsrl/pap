import {Address, User} from '../../core/auth/auth.model';
import {TrashBookType} from '../../features/trash-book/trash-book-model';

export interface TicketForm {
  cancel: string;
  finalMessage: string;
  pages: number;
  step: TicketFormStep[];
  translationsObj: any;
}
export interface TicketFormStep {
  extraOptions?: TicketFormOption[];
  label: string;
  options?: TicketFormOption[];
  recap?: string;
  required: boolean;
  translationsObj?: any;
  type: TicketFieldTypes;
  value?: any;
}

export interface TicketFormOption {
  label: string;
  show: boolean;
  value: string;
}
export interface Ticket {
  address_id?: number;
  company_id: number;
  created_at: string;
  geometry?: string;
  id: number;
  image?: string;
  location: number[];
  location_address: string;
  missed_withdraw_date?: string;
  note?: string;
  phone?: string;
  ticket_type: TicketType;
  trashType?: TrashBookType;
  trash_type_id: number;
  updated_at: string;
  user_id: number;
}

export type TicketFieldTypes =
  | 'ticket_type'
  | 'trash_type_id'
  | 'user_id'
  | 'location'
  | 'image'
  | 'note'
  | 'phone'
  | 'calendar_trash_type_id'
  | 'house_number';

export type TicketType = 'reservation' | 'info' | 'abandonment' | 'report';

export interface SuccessResponse {
  data: {
    address: Address;
    ticket_type: TicketType;
    company_id: string;
    user_id: number;
    trash_type_id: number;
    note: string;
    image: null | string;
    geometry: string;
    location_address: string;
    updated_at: string;
    created_at: string;
    id: number;
    trash_type?: TrashBookType;
    user: User;
  };
  message: string;
  success: boolean;
}

export interface SuccessData<T> {
  data: T;
  message: string;
}
