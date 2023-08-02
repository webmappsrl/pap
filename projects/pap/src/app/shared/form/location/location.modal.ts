import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ModalController} from '@ionic/angular';

@Component({
  selector: 'pap-location-modal',
  templateUrl: 'location.modal.html',
  styleUrls: ['./location.modal.scss'],
})
export class LocationModalComponent {
  modalForm: FormGroup = this._formBuilder.group({
    address:  ['', [Validators.required]],
    location: [[], [Validators.required]],
  });

  constructor(private _modalCtrl: ModalController, private _formBuilder: FormBuilder) {}

  cancel() {
    return this._modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this._modalCtrl.dismiss(this.modalForm.value);
  }

  setAddess(event: any): void {
    const address = event.address;
    if (address != null) {
      this.modalForm.get('address')?.setValue(address);
    }
  }
}
