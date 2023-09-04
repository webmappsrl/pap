import {buttonInfo} from '../../features/home/home.model';

export interface menuButton {
  buttonEnd?: buttonInfo;
  buttonStart?: buttonInfo;
  img?: string;
  isMenuOpen: boolean;
  label?: string;
  showBack: boolean;
}
