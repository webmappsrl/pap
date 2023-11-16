import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'pap-form-recap-row',
  templateUrl: './recap-row.component.html',
  styleUrls: ['./recap-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecapRowComponent {}
