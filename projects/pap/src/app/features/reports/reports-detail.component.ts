import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Ticket} from './state/reports.effects';

@Component({
  selector: 'pap-reports-detail',
  templateUrl: './reports-detail.component.html',
  styleUrls: ['./reports-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportsDetailComponent {
  @Input() report!: Ticket;

  constructor() {}
}
