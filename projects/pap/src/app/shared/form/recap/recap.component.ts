import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'pap-form-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecapComponent {}
