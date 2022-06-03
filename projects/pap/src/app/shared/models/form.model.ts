import {TicketFieldTypes, TicketType} from '../form/model';

export interface TicketFormConf {
  cancel: string;
  finalMessage: string;
  translationsObj: any;
  pages: number;
  ticketType: TicketType;
  step: TicketFormStep[];
}

export interface TicketFormStep {
  label: string;
  type: TicketFieldTypes | FormFieldTypes;
  mandatory: boolean;
  value?: any;
  translationsObj?: any;
  options?: TicketFormOption[];
  extraOptions?: TicketFormOption[];
  recap?: string;
  placeholder?: string;
}
export type FormFieldTypes = 'label' | 'radio';
export interface TicketFormOption {
  label: string;
  value: string;
  show: boolean;
  translationsObj?: any;
}
