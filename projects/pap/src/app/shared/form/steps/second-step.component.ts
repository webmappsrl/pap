import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormProvider} from '../form-provider';

@Component({
  template: `
      <form [formGroup]="secondStep">
      <ion-item>
        <ion-label position="stacked" position="fixed">Password</ion-label>
        <ion-input required formControlName="password" placeholder="Inserire la password" type="password">
        </ion-input>
      </ion-item>
      <ion-item *ngIf="secondStep.controls['password'].errors as errors">
        <pap-error-form-handler [errors]="errors"></pap-error-form-handler>
      </ion-item>
      <ion-item>
        <ion-label position="stacked" position="fixed">Conferma password</ion-label>
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
          <ion-col class="ion-align-self-start">
            <ion-button (click)="prev.emit()"  expand="full" >
            <ion-icon name="chevron-back"></ion-icon>
            </ion-button>
          </ion-col>
          <ion-col class="ion-align-self-center"></ion-col>
          <ion-col class="ion-align-self-end">
            <ion-button [disabled]="secondStep.invalid" (click)="next.emit()"  expand="full" >
            <ion-icon name="chevron-forward"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      </form>
    `,
  selector: 'pap-second-step-signup-form',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class secondStepSignupComponent {
  secondStep: FormGroup = this._formProvider.getForm().get('secondStep') as FormGroup;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();
  @Input() buttons = true;
  constructor(private _formProvider: FormProvider) {}
}
