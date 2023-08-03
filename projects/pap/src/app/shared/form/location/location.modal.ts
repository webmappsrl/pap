import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ModalController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../../core/core.state';
import {currentZone} from '../../map/state/map.selectors';

@Component({
  selector: 'pap-location-modal',
  templateUrl: 'location.modal.html',
  styleUrls: ['./location.modal.scss'],
})
export class LocationModalComponent {
  confiniZone$: Observable<any> = this._store.select(currentZone);
  modalForm: FormGroup = this._formBuilder.group({
    address: ['', [Validators.required]],
    zone_id: ['', [Validators.required]],
    location: [[], [Validators.required]],
  });

  constructor(
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
    private _store: Store<AppState>,
  ) {
    this.confiniZone$.subscribe(zone => {
      console.log(zone);
    });
  }

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
