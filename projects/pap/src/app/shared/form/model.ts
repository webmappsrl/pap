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
  image?: string;
  // (FK id dell'utente loggato)
  location: number[];
  // (long,lat)
  location_address: string;
  // (base64)
  note?: string;
  phone?: string;
  ticket_type: TicketType;
  trash_type_id: number;
  // (FK recuperato da http://portapporta.webmapp.it/c/4/trash_types.json)
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
  | 'calendar_trash_type_id';

export type TicketType = 'reservation' | 'info' | 'abandonment' | 'report';
