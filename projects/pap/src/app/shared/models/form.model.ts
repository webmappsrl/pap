import {environment} from 'projects/pap/src/environments/environment';
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
  type: TicketFieldTypes | FormFieldTypes | 'recap';
  value?: any;
}

export type FormFieldTypes = 'label' | 'select';
export interface TicketFormOption {
  label: string;
  show: boolean;
  translationsObj?: any;
  value: string;
}

export const ticketReservationForm: TicketFormConf = {
  ticketType: 'reservation',
  label: 'Prenotazione servizio',
  cancel: 'Sicuro di voler cancellare la prenotazione?',
  finalMessage: `La tua richiesta è stata inoltrata correttamente a ${environment.config.name}: verrai ricontattato quanto prima via email per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni con ${environment.config.name}. Puoi rivedere tutte le tue segnalazioni nella sezione “Le mie Segnalazioni”`,
  pages: 6,
  step: [
    {
      label: `Questo serivizio ti permette di inviare una richiesta di prenotazione di un servizio ${environment.config.name}. Al termine della segnalazione ti verrà assegnato un codice della segnalazione e verrà inviata una email a ${environment.config.name}: verrai ricontattato concordare i dettagli della prenotazione. Clicca sul bottone “Procedi” per iniziare.`,
      type: 'label',
      required: false,
    },
    {
      label: 'Scegli il tipo di servizio da prenotare:',
      type: 'trash_type_id',
      required: true,
      recap: 'Servizio',
    },
    {
      label: 'Seleziona il luogo:',
      type: 'location',
      required: true,
      recap: 'Indirizzo',
    },
    {
      label: 'Puoi aggiungere una foto: ci aiuterà a capire meglio la situazione',
      type: 'image',
      required: false,
      recap: 'Immagine',
    },
    {
      label: 'Se lo ritieni opportuno, puoi inserire delle note',
      type: 'note',
      required: false,
      recap: 'Note',
    },
    {
      label: '',
      type: 'recap',
      required: false,
    },
  ],
};

export const abandonmentTicketForm: TicketFormConf = {
  cancel: 'Sicuro di voler cancellare la prenotazione?',
  finalMessage: `La tua richiesta è stata inoltrata correttamente a ${environment.config.name}: verrai ricontattato quanto prima via email per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni con ${environment.config.name}. Puoi rivedere tutte le tue segnalazioni nella sezione “Le mie Segnalazioni”`,
  pages: 5,
  ticketType: 'abandonment',
  label: 'Segnalazione di abbandono',
  step: [
    {
      label: `Questo serivizio ti permette di inviare una segnalazione di abbandono ad ${environment.config.name}. Al termine della segnalazione ti verrà assegnato un codice e verrà inviata una email a ${environment.config.name}. Clicca sul bottone “Procedi” per iniziare.`,
      type: 'label',
      required: false,
    },
    {
      label: 'Scegli il tipo di abbandono:',
      type: 'trash_type_id',
      required: true,
      recap: 'Servizio',
    },
    {
      label: '',
      type: 'location',
      required: true,
      recap: 'Indirizzo',
    },
    {
      label: 'Aggiungi una foto: ci aiuterà a capire la situazione',
      type: 'image',
      required: false,
      recap: 'Immagine',
    },
    {
      label: 'Se lo ritieni opportuno puoi inserire delle note',
      type: 'note',
      required: false,
      recap: 'Note',
    },
    {
      label: '',
      type: 'recap',
      required: false,
    },
  ],
};

export const reportTicketForm: TicketFormConf = {
  ticketType: 'report',
  cancel: 'Sicuro di voler cancellare la prenotazione?',
  finalMessage: `La tua richiesta è stata inoltrata correttamente a ${environment.config.name}: verrai ricontattato quanto prima via email per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni con ${environment.config.name}. Puoi rivedere tutte le tue segnalazioni nella sezione “Le mie Segnalazioni”`,
  pages: 5,
  label: 'Segnalazione mancato ritiro',
  step: [
    {
      label: `Questo servizio ti permette di segnalare ad ${environment.config.name} un mancato ritiro del servizio di raccolta porta a porta. Al termine ti verrà assegnato un codice e verrà inviata una email a ${environment.config.name}: verrai ricontattato in caso di necessità. Clicca sul bottone “Procedi” per iniziare.`,
      type: 'label',
      required: false,
    },
    {
      label: 'Scegli il tipo di servizio che non ha funzionato:',
      type: 'calendar_trash_type_id',
      required: true,
      recap: 'Servizio',
    },
    {
      label: 'Puoi aggiungere una foto: ci aiuterà a capire meglio cosa è successo',
      type: 'image',
      required: false,
      recap: 'Immagine',
    },
    {
      label: 'Se lo ritieni opportuno puoi inserire delle note',
      type: 'note',
      required: false,
      recap: 'Note',
    },
    {
      label: '',
      type: 'recap',
      required: false,
    },
  ],
};

export const infoTicketForm: TicketFormConf = {
  ticketType: 'info',
  cancel: 'Uscendo perderai tutti i dati inseriti. Sicuro di volerlo fare?',
  finalMessage:
    'La tua richiesta è stata inoltrata correttamente: verrai ricontattato quanto prima per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni. Puoi rivedere tutte le tue segnalazioni nella sezione "Le mie Segnalazioni"',
  translationsObj: {
    finalMessage: {
      companyName: 'APP.company',
    },
  },
  label: 'Richiesta informazioni',
  pages: 3,
  step: [
    {
      label: `Questo serivizio ti permette di richiedere informazioni direttamente a ${environment.config.name}. Al termine ti verrà assegnato un codice della richiesta e verrà inviata una email a ${environment.config.name}: verrai ricontattato appena possibile. Clicca sul bottone ' >          ' per iniziare.`,
      type: 'label',
      required: false,
      translationsObj: {
        label: {
          companyName: 'APP.company',
        },
      },
    },
    {
      label: `Scrivi qui le informazioni che vorresti richiedere a ${environment.config.name}`,
      type: 'note',
      required: true,
      value: '',
      recap: 'Richiesta',
      translationsObj: {
        label: {
          companyName: 'APP.company',
        },
      },
    },
    {
      label: '',
      type: 'recap',
      required: false,
    },
  ],
};
