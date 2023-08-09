import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {AppState} from '../../../core/core.state';
import {FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {FormProvider} from '../form-provider';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {calendarSettings} from '../../../features/settings/state/settings.selectors';
import {loadCalendarSettings} from '../../../features/settings/state/settings.actions';
import {Address} from '../../../features/settings/settings.model';
import {SettingsService} from '../../../features/settings/state/settings.service';
import {RadioGroupChangeEventDetail} from '@ionic/angular';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'pap-third-step-signup-form',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class thirdStepSignupComponent implements OnInit {
  @Input() buttons = true;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  calendarSettings$: Observable<any> = this._store.select(calendarSettings);
  thirdStep: UntypedFormGroup;

  constructor(
    private _store: Store<AppState>,
    private _settingSvc: SettingsService,
    private _parent: FormGroupDirective,
  ) {
    this._store.dispatch(loadCalendarSettings());
    this.calendarSettings$.subscribe(res => {
      console.log(res);
    });
  }

  ngOnInit(): void {
    this.thirdStep = this._parent.form.get('thirdStep') as UntypedFormGroup;
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
