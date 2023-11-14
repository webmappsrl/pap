import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FormProvider} from '../form-provider';

@Component({
  template: `
      <form [formGroup]="secondStep">
        <ion-list lines="inset">
          <ion-item>
            <ion-label position="stacked" position="floating">Password*</ion-label>
            <ion-input required formControlName="password" placeholder="Inserire la password" type="password">
            </ion-input>
          </ion-item>
          <ion-item *ngIf="secondStep.controls['password'].errors as errors">
            <pap-error-form-handler [errors]="errors"></pap-error-form-handler>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" position="floating">Conferma password*</ion-label>
            <ion-input
              required
              formControlName="password_confirmation"
              placeholder="Inserire la password"
              type="password"
            >
            </ion-input>
          </ion-item>
          <ion-item *ngIf="secondStep.controls['password_confirmation'].errors as errors">
            <pap-error-form-handler [errors]="errors"></pap-error-form-handler>
          </ion-item>
          <ion-grid *ngIf="buttons">
      <ion-row>
        <ion-col
          size="6"
          size-sm="4">
          <ion-button
            shape="round"
            (click)="prev.emit()"
            expand="block">
            <ion-icon
              slot="start"
              name="chevron-back"></ion-icon>
          </ion-button>
        </ion-col>
        <ion-col
          size="6"
          size-sm="4"
          offset-sm="4">
          <ion-button
            shape="round"
            [disabled]="secondStep.invalid"
            (click)="next.emit()"
            expand="block"
            class="ion-float-right">
            <ion-icon
              slot="end"
              name="chevron-forward"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
        </ion-list>
      </form>
    `,
  selector: 'pap-second-step-signup-form',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class secondStepSignupComponent {
  @Input() buttons = true;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  secondStep: UntypedFormGroup = this._formProvider.getForm().get('secondStep') as UntypedFormGroup;

  constructor(private _formProvider: FormProvider) {}
}
