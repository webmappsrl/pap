import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {TrashBookType} from '../trash-book-model';

@Component({
  selector: 'pap-trash-book-type',
  templateUrl: './trash-book-type.component.html',
  styleUrls: ['./trash-book-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookTypeComponent {
  @Input() trashBookType!: TrashBookType;

  constructor() {}
}
