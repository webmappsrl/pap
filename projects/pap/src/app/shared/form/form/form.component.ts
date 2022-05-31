import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {AlertController, IonInput} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

const ADDRESS_INDEX = 1;
const REGEX_NUMBER = /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
const REGEX_EMAIL =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'pap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent {
  @Input() form: any;
  @Input() loading!: any;
  @Input() pos: number = 0;
  // @Input('code') code: number;
  @Input() extra: boolean = false;
  @Output() onFormFilled = new EventEmitter();
  @Output() onClickExit = new EventEmitter();
  @Output() onCheckEmail = new EventEmitter();
  @Output() onLocating = new EventEmitter();
  @Output() onReverseLocating = new EventEmitter();
  // @ViewChild(Content) content: Content;

  @ViewChild('focusInput')
  focusInput!: IonInput;

  constructor(private _translateService: TranslateService, private alertCtrl: AlertController) {}

  currentForm() {
    return this.form.step[this.pos];
  }

  addressOnChange(event: any) {
    if (event?.target && typeof event.target.value === 'string') {
      let address: string = event.target.value;
      this.currentForm().value[ADDRESS_INDEX] = address;
      this.onLocating.emit([address, this.pos]);
    }
  }

  saveImage(event: any) {
    this.currentForm().value = event;
    // this.content.resize();
  }

  isChecked(def: any, value: any): boolean {
    return JSON.stringify(def) === JSON.stringify(value);
  }

  getValue(item: any): string {
    return JSON.stringify(item.value);
  }

  //  getAddress(e: any) {}

  radioClick(value: any) {
    this.currentForm().value = value;
  }

  sendExit() {
    if (this.form.cancel) {
      this.sendAlert(this._translateService.instant(this.form.cancel));
    } else this.onClickExit.emit();
  }

  backStep() {
    if (this.pos === 0) this.sendExit();
    else {
      this.pos--;
      this.setFocus();
    }
  }

  nextStep() {
    if (this.isValid() && this.pos + 1 < this.form.step.length) {
      this.pos++;
      this.setFocus(350);
    }
  }

  setFocus(delay: number = 150) {
    setTimeout(() => {
      if (this.focusInput) {
        this.focusInput.setFocus();
      }
      // if (this.code1) {
      //   this.code1.setFocus();
      //   this.content.scrollTo(0, 500);
      // }
    }, delay);
  }

  sendData() {
    if (!this.isValid) {
      return;
    }

    this.onFormFilled.emit(this.form);
    // } else {
    //   if (
    //     this.currentForm().value[0] !== '' &&
    //     this.currentForm().value[1] !== '' &&
    //     this.currentForm().value[2] !== '' &&
    //     this.currentForm().value[3] !== ''
    //   )
    //     this.sendToast(this._translateService.instant('messages.wrongCode'));
    //   else this.sendToast(this._translateService.instant('messages.invalidCode'));
    // }
  }

  isValid() {
    let res = true;

    if (!this.shouldAccept()) {
      this.sendToast(this._translateService.instant('messages.mandatory'));
      res = false;
    }

    if (this.isInvalidPhone()) {
      this.sendToast(this._translateService.instant('messages.invalidNumber'));
      res = false;
    }

    if (this.isInvalidEmail()) {
      this.sendToast(this._translateService.instant('messages.validEmail'));
      res = false;
    }

    if (this.isInvalidLocation()) {
      this.sendToast(this._translateService.instant('messages.validPosition'));
      res = false;
    }

    if (
      this.currentForm().type === 'location' &&
      this.currentForm().value[1] === '' &&
      this.currentForm().value[2][1] === ''
    ) {
      this.sendToast(this._translateService.instant('messages.validPosition'));
      res = false;
    }

    return res;
  }

  isInvalidEmail(): boolean {
    if (this.currentForm().type === 'email') {
      if (REGEX_EMAIL.test(this.currentForm().value)) {
        this.onCheckEmail.emit([this.currentForm().value, this.pos]);
      } else {
        return false;
      }
    }
    return false;
  }

  isInvalidLocation(): boolean {
    return (
      this.currentForm().type === 'location' &&
      (this.currentForm().value === null ||
        !this.currentForm().value[0] ||
        !this.currentForm().value[1])
    );
  }

  isInvalidPhone(): boolean {
    return (
      this.currentForm().type === 'tel' &&
      this.currentForm().value !== '' &&
      !REGEX_NUMBER.test(this.currentForm().value)
    );
  }

  shouldAccept(): boolean {
    let isMandatory: boolean = this.currentForm().mandatory;
    let isValid: boolean =
      !['checkbox', 'switch'].includes(this.currentForm().type) &&
      this.currentForm().value !== null &&
      this.currentForm().value !== '';
    let isValidChoice: boolean =
      ['checkbox', 'switch'].includes(this.currentForm().type) && this.currentForm().value === true;

    return !isMandatory || (isMandatory && isValid) || (isMandatory && isValidChoice);
  }

  changeFocus(n: number) {}

  sendToast(message: string) {}

  async sendAlert(message: string) {
    let alert = await this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: this._translateService.instant('messages.exit'),
          handler: () => {
            this.onClickExit.emit();
          },
        },
        {
          text: this._translateService.instant('messages.continue'),
          role: 'cancel',
        },
      ],
    });
    alert.present();
  }
}
