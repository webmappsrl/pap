import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../../core/core.state';
import {currentZone} from '../../map/state/map.selectors';
import {AddressEvent} from './location.model';

@Component({
  selector: 'pap-location-modal',
  templateUrl: 'location.modal.html',
  styleUrls: ['./location.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LocationModalComponent {
  availableUserTypes: any[];
  currentZone$: Observable<any> = this._store.select(currentZone);
  features: any[];
  modalForm: FormGroup = this._formBuilder.group({
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    house_number: [''],
    zone_id: ['', [Validators.required]],
    user_type_id: ['', [Validators.required]],
    location: [[], [Validators.required]],
  });

  constructor(
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
    private _store: Store<AppState>,
  ) {}

  cancel(): void {
    this._modalCtrl.dismiss(null, 'cancel');
  }

  confirm(): void {
    this._modalCtrl.dismiss(this.modalForm.value);
  }

  setAddress(event: AddressEvent): void {
    this.modalForm.get('city')?.setValue(event.city);
    this.modalForm.get('address')?.setValue(event.address);
    this.modalForm.get('house_number')?.setValue(event.house_number);
  }

  setUserType(event: Event): void {
    const customEvent = event as CustomEvent<{value: number}>;
    const userTypeId = customEvent.detail.value;
    this.modalForm.get('user_type_id')?.setValue(userTypeId);
  }
}
