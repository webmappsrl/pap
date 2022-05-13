import { buttonInfo } from "./buttonInfo";

export interface headerInfo {
    label?: string,
    img?: string,
    showBack: boolean;
    buttonStart?: buttonInfo,
    buttonEnd?: buttonInfo,
}