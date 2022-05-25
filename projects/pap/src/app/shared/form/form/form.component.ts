import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input('form') form: any;
  @Input('loading') loading!: any;
  @Input('pos') pos: number = 0;
  // @Input('code') code: number;
  @Input('extra') extra: boolean = false;
  @Output() onFormFilled = new EventEmitter();
  @Output() onClickExit = new EventEmitter();
  @Output() onCheckEmail = new EventEmitter();
  @Output() onLocating = new EventEmitter();
  @Output() onReverseLocating = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

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
