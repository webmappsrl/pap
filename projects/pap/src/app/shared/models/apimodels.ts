export interface ApiTicket {
  // (long,lat)
  image?: string;
  // (FK id dell'utente loggato)
  location: number[];
  // (base64)
  note?: string;
  phone?: string;
  ticket_type: ApiTicketType;
  trash_type_id: number;
  // (FK recuperato da http://portapporta.webmapp.it/c/4/trash_types.json)
  user_id: number;
}

export enum ApiTicketType {
  RESERVATION = 'reservation',
  INFO = 'info',
  ABANDONMENT = 'abandonment',
  REPORT = 'report',
}
