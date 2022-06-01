export interface TicketForm {
  cancel: string;
  finalMessage: string;
  translationsObj: any;
  pages: number;
  step: TicketFormStep[];
}

export interface TicketFormStep {
  label: string;
  type: 'label' | 'textarea' | 'image' | 'radio' | 'location' | 'tel';
  mandatory: boolean;
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
