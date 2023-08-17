export interface TicketForm {
  cancel: string;
  finalMessage: string;
  translationsObj: any;
  pages: number;
  step: TicketFormStep[];
}
export interface TicketFormStep {
  label: string;
  type: TicketFieldTypes;
  required: boolean;
  value?: any;
  translationsObj?: any;
  options?: TicketFormOption[];
  extraOptions?: TicketFormOption[];
  recap?: string;
}

export interface TicketFormOption {
  label: string;
  value: string;
  show: boolean;
}
export interface Ticket {
  ticket_type: TicketType;
  trash_type_id: number; // (FK recuperato da http://portapporta.webmapp.it/c/4/trash_types.json)
  user_id: number; // (FK id dell'utente loggato)
  location: number[]; // (long,lat)
  location_address: string;
  image?: string; // (base64)
  note?: string;
  phone?: string;
}

export type TicketFieldTypes =
  | 'ticket_type'
  | 'trash_type_id'
  | 'user_id'
  | 'location'
  | 'image'
  | 'note'
  | 'phone'
  | 'calendar_trash_type_id';

export type TicketType = 'reservation' | 'info' | 'abandonment' | 'report';
