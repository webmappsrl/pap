export interface ApiTicket {
  ticket_type: ApiTicketType;
  trash_type_id: number; // (FK recuperato da http://portapporta.webmapp.it/c/4/trash_types.json)
  user_id: number; // (FK id dell'utente loggato)
  location: number[]; // (long,lat)
  image?: string; // (base64)
  note?: string;
  phone?: string;
}

export enum ApiTicketType {
  RESERVATION = 'reservation',
  INFO = 'info',
  ABANDONMENT = 'abandonment',
  REPORT = 'report',
}
