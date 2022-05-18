export interface buttonInfo {
  action: buttonAction;
  url?: string;
  icon?: string;
  img?: string;
  label: string;
  disabled?: boolean;
  class?: string;
  hideInHome?: boolean;
  hideInMenu?: boolean;
}

export enum buttonAction {
  NAVIGATION = 'navigation',
  OPENMENU = 'open-menu',
}
