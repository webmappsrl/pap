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
import {calendarSettings} from '../../../features/settings/state/settings.selectors';
import {loadCalendarSettings} from '../../../features/settings/state/settings.actions';

@Component({
  selector: 'pap-third-step-signup-form',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class thirdStepSignupComponent {
  @Input() buttons = true;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  calendarSettings$: Observable<any> = this._store.select(calendarSettings);
  thirdStep: UntypedFormGroup = this._formProvider.getForm().get('thirdStep') as UntypedFormGroup;

  constructor(private _formProvider: FormProvider, private _store: Store<AppState>) {
    this._store.dispatch(loadCalendarSettings());
    this.calendarSettings$.subscribe(res => {
      console.log(res);
    });
  }

  reset(): void {
    this.thirdStep.controls['user_type_id'].reset();
  }
}
