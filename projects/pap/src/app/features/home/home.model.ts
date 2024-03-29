import {environment} from 'projects/pap/src/environments/environment';

export interface buttonInfo {
  action: buttonAction;
  buttons?: any[];
  class?: string;
  disabled?: boolean;
  hideInHome?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  img?: string;
  label: string;
  svg?: string;
  url?: string;
}

export enum buttonAction {
  NAVIGATION = 'navigation',
  OPENMENU = 'open-menu',
  ACTION = 'action',
}

export const servicesButtons = [
  {
    text: 'Prenota un servizio di ritiro',
    icon: 'create',
    roles: ['contributor'],
    data: {
      action: 'ticket-reservation',
    },
  },
  {
    text: 'Segnala abbandono',
    icon: 'trash-bin',
    data: {
      action: 'abandonment-ticket',
    },
  },
  {
    text: 'Segnala mancato ritiro',
    icon: 'alert-circle',
    data: {
      action: 'report-ticket',
    },
  },
  {
    text: 'Richiedi Informazioni',
    icon: 'information-circle',
    data: {
      action: 'info-ticket',
    },
  },
  {
    text: 'CHIUDI',
    role: 'cancel',
  },
];
export const homeButtons = [
  {
    label: environment.config.name,
    img: 'assets/icons/app_icon.png',
    url: 'info',
    action: buttonAction.NAVIGATION,
  },
  {
    label: 'Servizio VIP',
    icon: 'star',
    url: 'ticket-vip-reservation',
    action: buttonAction.NAVIGATION,
    roles: ['vip'],
  },
  {
    label: 'Calendari',
    icon: 'calendar',
    url: 'calendar',
    action: buttonAction.NAVIGATION,
  },
  {
    label: 'Servizi',
    svg: 'assets/icons/logo-call.svg',
    url: 'ticket-reservation',
    action: buttonAction.ACTION,
    buttons: servicesButtons,
  },
  {
    label: 'I miei ticket',
    icon: 'archive',
    url: 'reports',
    action: buttonAction.NAVIGATION,
  },
  {
    label: 'Segnalazioni',
    icon: 'archive',
    url: 'dusty-man-reports',
    action: buttonAction.NAVIGATION,
    roles: ['dusty_man'],
  },
  {
    label: 'Centri di Raccolta',
    icon: 'map',
    url: 'waste-center-collection',
    action: buttonAction.NAVIGATION,
    hideInMenu: true,
  },
  {
    label: 'Rifiutario',
    icon: 'document-text',
    url: 'trashbook',
    action: buttonAction.NAVIGATION,
  },
  {
    label: 'Centro notifiche',
    url: 'notification',
    action: buttonAction.NAVIGATION,
    hideInHome: true,
  },
  {
    label: 'Impostazioni',
    url: 'settings',
    action: buttonAction.NAVIGATION,
    hideInHome: true,
  },
];
export const noLoggedButtons = [
  {
    text: 'accedi',
    role: 'sign-in',
  },
  {
    text: 'registrati',
    role: 'sign-up',
  },
  {
    text: 'password dimenticata?',
    role: 'forgot-password',
  },
  {
    text: 'X',
    role: 'cancel',
  },
];
