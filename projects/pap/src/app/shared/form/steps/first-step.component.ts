import {CalendarRoutingModule} from './../../../features/calendar/calendar-routing.module';
import {currentAddress} from './../../map/state/map.selectors';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, UntypedFormGroup} from '@angular/forms';
import {FormProvider} from '../form-provider';
import {IonModal} from '@ionic/angular';
import {OverlayEventDetail} from '@ionic/core/components';
@Component({
  templateUrl: './first-step.component.html',
  selector: 'pap-first-step-signup-form',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class firstStepSignupComponent {
  @ViewChild(IonModal) modal!: IonModal;
  modalAddress: string = '';
  modalLocation: [] = [];
  modalForm: FormGroup = this._formBuilder.group({
    address: '',
    location: '',
  });
  firstStep: UntypedFormGroup = this._formProvider.getForm().get('firstStep') as UntypedFormGroup;
  get addresses() {
    return this.firstStep.get('addresses') as FormArray;
  }
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Input() buttons = true;
  @Input() disable: string[] = [];

  constructor(private _formProvider: FormProvider, private _formBuilder: FormBuilder) {}

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    console.log(this.modalAddress);
    this.addresses.push(this.modalForm);
    this.modalAddress = '';
    this.modalLocation = [];
    this.modal.dismiss();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  createAddress(): FormGroup {
    return this._formBuilder.group({
      address: '',
      location: [],
    });
  }

  addAddress(): void {
    this.addresses.push(this.createAddress());
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }
  setLocation(event: any): void {
    console.log(event);
    this.modalLocation = event.location;
  }
}
