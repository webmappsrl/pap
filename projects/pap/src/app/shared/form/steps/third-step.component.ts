import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {AppState} from '../../../core/core.state';
import {UntypedFormGroup} from '@angular/forms';
import {FormProvider} from '../form-provider';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {currentUserTypes} from '../state/sign-up.selectors';
import {currentZone} from '../../map/state/map.selectors';
import {loadConfiniZone} from '../../map/state/map.actions';
import {loadUserTypes} from '../state/sign-up.actions';
import {calendarSettings} from '../../../features/settings/state/settings.selectors';
import {loadCalendarSettings} from '../../../features/settings/state/settings.actions';

@Component({
  template: `
      <form [formGroup]="thirdStep">
        <div class="scrollable">
          <ion-item>
            <pre>{{calendarSettings$|async|json}}</pre>
          </ion-item>
        </div>
        <ion-grid *ngIf="buttons">
          <ion-row>
            <ion-col class="ion-align-self-start">
            <ion-button (click)="prev.emit()"  expand="full" >
              <ion-icon name="chevron-back" ></ion-icon>
            </ion-button>
            </ion-col>
            <ion-col class="ion-align-self-center"></ion-col>
            <ion-col class="ion-align-self-end">
            <ion-button [disabled]="thirdStep.invalid" (click)="next.emit()"  expand="full" >
              <ion-icon color="light" name="checkmark"></ion-icon>
            </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    `,
  selector: 'pap-third-step-signup-form',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class thirdStepSignupComponent {
  @Input() buttons = true;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  calendarSettings$: Observable<any> = this._store.select(calendarSettings);
  confiniZone$: Observable<any> = this._store.select(currentZone);
  thirdStep: UntypedFormGroup = this._formProvider.getForm().get('thirdStep') as UntypedFormGroup;
  userTypes$: Observable<any> = this._store.select(currentUserTypes);

  constructor(private _formProvider: FormProvider, private _store: Store<AppState>) {
    this._store.dispatch(loadCalendarSettings());
  }

  reset(): void {
    this.thirdStep.controls['user_type_id'].reset();
  }
}
