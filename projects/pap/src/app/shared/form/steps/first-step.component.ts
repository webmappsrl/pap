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
    <form [formGroup]="firstStep">
      <ion-item>
        <ion-label position="stacked" position="fixed">Nome</ion-label>
        <ion-input formControlName="name" required placeholder="Inserire il nome"> </ion-input>
      </ion-item>
      <ion-item *ngIf="firstStep.controls['name'].errors as errors">
        <pap-error-form-handler [errors]="errors"></pap-error-form-handler>
      </ion-item>
      <ion-item>
        <ion-label position="stacked" position="fixed">Email</ion-label>
        <ion-input formControlName="email" required placeholder="Inserire la email"> </ion-input>
      </ion-item>
      <ion-item *ngIf="firstStep.controls['email'].errors as errors">
        <pap-error-form-handler [errors]="errors"></pap-error-form-handler>
      </ion-item>
      <ion-grid *ngIf="buttons">
        <ion-row>
          <ion-col size="8">
          </ion-col>
          <ion-col>
            <ion-button [disabled]="firstStep.invalid" (click)="next.emit()"  expand="full">
              <ion-icon name="chevron-forward"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </form>
    `,
  selector: 'pap-first-step-signup-form',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class firstStepSignupComponent {
  firstStep: FormGroup = this._formProvider.getForm().get('firstStep') as FormGroup;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Input() buttons = true;

  constructor(private _formProvider: FormProvider) {}
}
