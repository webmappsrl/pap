import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

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

  constructor() {}

  sendData() {}

  addressOnChange(event: any) {}

  saveImage(event: any) {}

  isChecked(def: any, value: any): boolean {
    return false;
  }

  getValue(item: any) {}

  getAddress(e: any) {}

  radioClick(value: any) {}
  sendExit() {}
  sendBack() {}

  changeFocus(n: number) {}
}
