import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {TicketFormConf, TicketFormStep} from '../../models/form.model';

@Component({
  selector: 'pap-form-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecapComponent {
  @Input() form!: FormGroup;
  @Input() set conf(c: TicketFormConf) {
    const recapSteps = c.step.filter(s => s.recap != null);
    this.steps$.next(recapSteps);
  }
  steps$: BehaviorSubject<TicketFormStep[]> = new BehaviorSubject<TicketFormStep[]>([]);
  constructor(private _translateService: TranslateService) {}

  getTranslation(field: any) {
    if (field.type === 'radio') {
      for (let i in field.options) {
        if (field.options[i].value === field.default)
          return this._translateService.instant(field.options[i].label);
      }
    }

    return field.default;
  }
}
