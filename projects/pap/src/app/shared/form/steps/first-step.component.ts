import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormArray, FormBuilder, UntypedFormGroup} from '@angular/forms';
import {FormProvider} from '../form-provider';
import {IonModal, ModalController} from '@ionic/angular';
import {LocationModalComponent} from '../location/location.modal';
import {map, switchMap, take} from 'rxjs/operators';
import {from} from 'rxjs';
@Component({
  selector: 'pap-first-step-signup-form',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss'],

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class firstStepSignupComponent {
  get addresses() {
    return this.firstStep.get('addresses') as FormArray;
  }

  @Input() buttons = true;
  @Input() disable: string[] = [];
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(IonModal) modal!: IonModal;

  firstStep: UntypedFormGroup = this._formProvider.getForm().get('firstStep') as UntypedFormGroup;

  constructor(
    private _formProvider: FormProvider,
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
  ) {}

  openModalLocation() {
    from(
      this._modalCtrl.create({
        component: LocationModalComponent,
        cssClass: 'pap-location-modal',
      }),
    )
      .pipe(
        take(1),
        switchMap(m => {
          m.present();
          return m.onDidDismiss();
        }),
        map(res => res.data),
      )
      .subscribe(address => {
        const modalForm = this._formBuilder.group({
          address: '',
          location: [],
        });
        modalForm.setValue(address);
        this.addresses.push(modalForm);
        this._cdr.detectChanges();
      });
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  setLocation(event: any): void {
    console.log(event);
  }
}
