import {Component, Input} from '@angular/core';

@Component({
  selector: 'pap-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent {
  @Input() dateKey: string;
}
