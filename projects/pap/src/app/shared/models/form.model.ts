import {TicketFieldTypes, TicketType} from '../form/model';

export interface TicketFormConf {
  cancel: string;
  finalMessage: string;
  label?: string;
  pages: number;
  step: TicketFormStep[];
  ticketType: TicketType;
  translationsObj?: any;
}

export interface TicketFormStep {
  extraOptions?: TicketFormOption[];
  label: string;
  options?: TicketFormOption[];
  placeholder?: string;
  recap?: string;
  required: boolean;
  translationsObj?: any;
  type: TicketFieldTypes | FormFieldTypes;
  value?: any;
}
export type FormFieldTypes = 'label' | 'select';
export interface TicketFormOption {
  label: string;
  show: boolean;
  translationsObj?: any;
  value: string;
}
