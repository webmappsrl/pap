import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'pap-form-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecapComponent {
  @Input() form: any;

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
