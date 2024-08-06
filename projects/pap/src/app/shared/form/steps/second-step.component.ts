import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormGroupDirective, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {FormJson} from '../model';
import {Store} from '@ngrx/store';
import {selectFormJsonByStep} from '../state/company.selectors';
import {BaseCustomForm} from '../base-custom-form.component';

@Component({
  template: `
      <form [formGroup]="secondStep">
        <ion-list lines="inset">
        <ng-container *ngIf="formJson$ | async as formJson">
          <ng-container *ngFor="let formField of formJson">
            <!-- Controllo se il tipo è 'group' -->
            <ng-container *ngIf="formField.type !== 'group'">
              <ion-item>
                <ion-label position="stacked">
                  {{ formField.label }}
                  <span *ngIf="isFieldRequired(formField)"> * </span>
                </ion-label>
                <ion-input
                  [type]="formField.type"
                  [formControlName]="formField.name"
                  [placeholder]="formField.placeholder">
                </ion-input>
              </ion-item>
              <ion-item *ngIf="secondStep.get(formField.name) != null && !secondStep.get(formField.name)!.valid">
                <pap-error-form-handler [errors]="secondStep.get(formField.name)!.errors"></pap-error-form-handler>
              </ion-item>
            </ng-container>
          </ng-container>
</ng-container>
          <ion-grid *ngIf="buttons">
            <ion-row>
              <ion-col
                size="6"
                size-sm="4">
                <ion-button
                  shape="round"
                  (click)="prev.emit()"
                  expand="block"
                  class="pap-second-step-signup-form-back-button">
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
                  class="ion-float-right pap-second-step-signup-form-next-button">
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
export class secondStepSignupComponent extends BaseCustomForm implements OnInit {
  @Input() buttons = true;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  formJson$: Observable<FormJson[] | undefined> = this._store.select(selectFormJsonByStep(2));
  secondStep: UntypedFormGroup;

  constructor(
    private _parent: FormGroupDirective,
    private _store: Store,
    fb: UntypedFormBuilder,
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.secondStep = this._parent.form.get('secondStep') as UntypedFormGroup;
  }
}
