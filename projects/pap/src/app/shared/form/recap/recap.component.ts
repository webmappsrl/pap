import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {AppState} from '@capacitor/app';
import {select, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {currentAddress} from '../../map/state/map.selectors';
import {TicketFormConf, TicketFormStep} from '../../models/form.model';
import {currentTrashBookType} from '../state/form.selectors';

@Component({
  selector: 'pap-form-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecapComponent {
  @Input() form!: UntypedFormGroup;
  @Input() set conf(c: TicketFormConf) {
    const recapSteps = c.step.filter(s => s.recap != null);
    this.steps$.next(recapSteps);
  }
  steps$: BehaviorSubject<TicketFormStep[]> = new BehaviorSubject<TicketFormStep[]>([]);
  currentTrashBookType$: Observable<TrashBookType | undefined> = this._store.pipe(
    select(currentTrashBookType),
  );
  constructor(private _translateSvc: TranslateService, private _store: Store<AppState>) {}

  getTranslation(field: any) {
    if (field.type === 'radio') {
      for (let i in field.options) {
        if (field.options[i].value === field.default)
          return this._translateSvc.instant(field.options[i].label);
      }
    }

    return field.default;
  }
}
