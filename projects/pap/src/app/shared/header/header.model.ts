import {buttonInfo} from '../../features/home/home.model';

export interface headerInfo {
  buttonEnd?: buttonInfo;
  buttonStart?: buttonInfo;
  img?: string;
  isMenuOpen: boolean;
  label?: string;
  showBack: boolean;
}
