import {buttonInfo} from '../../features/home/home.model';

export interface menuButton {
  showBack: boolean;
  isMenuOpen: boolean;
  label?: string;
  img?: string;
  buttonStart?: buttonInfo;
  buttonEnd?: buttonInfo;
}
