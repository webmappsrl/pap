import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'pap-error-form-handler',
  templateUrl: './error-form-handler.html',
  styleUrls: ['./error-form-handler.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ErrorFormHandlerComponent {
  @Input() errors: any = null;
  constructor() {}
}
