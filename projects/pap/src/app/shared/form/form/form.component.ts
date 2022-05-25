import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input('form') form;
  @Input('loading') loading;
  @Input('pos') pos: number;
  // @Input('code') code: number;
  @Input('extra') extra: boolean;
  @Output() onFormFilled = new EventEmitter();
  @Output() onClickExit = new EventEmitter();
  @Output() onCheckEmail = new EventEmitter();
  @Output() onLocating = new EventEmitter();
  @Output() onReverseLocating = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  sendData() {}

  addressOnChange(event) {}

  saveImage(event) {}

  isChecked(default, value) : boolean{
    return false;
  }

  getValue(item){

  }

  getAddress(e){

  }
  
  radioClick(value){

}
sendExit(){}
  sendBack(){}

changeFocus(n:number){}
}
