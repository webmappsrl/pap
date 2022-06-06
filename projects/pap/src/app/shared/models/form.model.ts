import {TicketFieldTypes, TicketType} from '../form/model';

export interface TicketFormConf {
  cancel: string;
  finalMessage: string;
  pages: number;
  ticketType: TicketType;
  step: TicketFormStep[];
  translationsObj?: any;
}

export interface TicketFormStep {
  label: string;
  type: TicketFieldTypes | FormFieldTypes;
  required: boolean;
  value?: any;
  translationsObj?: any;
  options?: TicketFormOption[];
  extraOptions?: TicketFormOption[];
  recap?: string;
  placeholder?: string;
}
export type FormFieldTypes = 'label' | 'select';
export interface TicketFormOption {
  label: string;
  value: string;
  show: boolean;
  translationsObj?: any;
}
