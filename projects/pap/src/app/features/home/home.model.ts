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
