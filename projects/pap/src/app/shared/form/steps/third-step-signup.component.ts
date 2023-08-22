import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormArray, FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {AlertController, IonModal} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {loadAuths} from '../../../core/auth/state/auth.actions';
import {AppState} from '../../../core/core.state';
import {Address} from '../../../features/settings/settings.model';
import {loadCalendarSettings} from '../../../features/settings/state/settings.actions';
import {calendarSettings} from '../../../features/settings/state/settings.selectors';
import {SettingsService} from '../../../features/settings/state/settings.service';
import {loadConfiniZone} from '../../map/state/map.actions';
import {confiniZone, currentZone} from '../../map/state/map.selectors';

@Component({
  selector: 'pap-third-step-signup-form',
  templateUrl: './third-step-signup.component.html',
  styleUrls: ['./third-step-signup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class thirdStepSignupComponent implements OnInit {
  currentZone$: Observable<any> = this._store.select(currentZone);
  confiniZone$: Observable<any> = this._store.select(confiniZone);
  get addresses() {
    return this.thirdStep.get('addresses') as FormArray;
  }
  @Input() buttons = true;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  thirdStep: UntypedFormGroup;
  availableUserTypes: any[];
  constructor(
    private _store: Store<AppState>,
    private _settingSvc: SettingsService,
    private _parent: FormGroupDirective,
  ) {
    this._store.dispatch(loadCalendarSettings());
    this._store.dispatch(loadConfiniZone());
  }

  setUserType(event: any): void {
    const userTypeId = event.target.value;
    this.thirdStep.get('user_type_id')?.setValue(userTypeId);
  }
  ngOnInit(): void {
    this.thirdStep = this._parent.form.get('thirdStep') as UntypedFormGroup;
  }
  setAddess(event: any): void {
    const address = event.address;
    if (address != null) {
      this.thirdStep.get('address')?.setValue(address);
    }
  }
  reset(): void {
    this.thirdStep.controls['user_type_id'].reset();
  }

  selectUserType(address: Address, userTypeEVT: any): void {
    console.log(address, userTypeEVT);
    const newAddress = {...address, ...{user_type_id: userTypeEVT.detail.value}};
    this._settingSvc
      .updateAddress({...address, ...{user_type_id: userTypeEVT.detail.value}})
      .pipe(
        take(1),
        map(res => {
          if (res.success) {
            return res.data.address;
          } else {
            return null;
          }
        }),
      )
      .subscribe(v => {
        console.log(v);
      });
  }
}
