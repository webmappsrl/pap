import {buttonInfo} from '../../features/home/home.model';

export interface headerInfo {
  label?: string;
  img?: string;
  showBack: boolean;
  buttonStart?: buttonInfo;
  buttonEnd?: buttonInfo;
  isMenuOpen: boolean;
}
