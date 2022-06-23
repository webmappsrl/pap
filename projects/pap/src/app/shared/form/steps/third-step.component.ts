import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../../core/core.state';
import {loadConfiniZone} from '../../map/state/map.actions';
import {currentZone} from '../../map/state/map.selectors';
import {FormProvider} from '../form-provider';
import {loadUserTypes} from '../state/sign-up.actions';
import {currentUserTypes} from '../state/sign-up.selectors';

@Component({
  template: `
      <form [formGroup]="thirdStep">
      <ion-item>
        <pap-form-location formControlName="location" (ngModelChange)="reset()"> </pap-form-location>
      </ion-item>
      <ion-item *ngIf="thirdStep.controls['location'].errors as errors">
        <pap-error-form-handler [errors]="errors"></pap-error-form-handler>
      </ion-item>
      <ng-container *ngIf="(confiniZone$|async) as zone; else noValidZone">
        <ion-item *ngIf="userTypes$|async as userTypes">
          <ng-container  *ngIf="userTypes.length >0;else noUserTypes">
            <pap-form-select formControlName="user_type_id" [options]="userTypes">
              </pap-form-select>
            </ng-container>
        </ion-item>
        <input
          hidden
          *ngIf="zone.properties as prop"
          required
          formControlName="zone_id"
          [ngModel]="prop.id"
        />
      </ng-container>
      <ng-template #noValidZone>
        <ion-item *ngIf="!thirdStep.controls['location'].errors">
          <ion-label color="danger">seleziona una zona valida</ion-label>
        </ion-item>
      </ng-template>
      <ng-template #noUserTypes>
        <ion-label>non ci sono tipi utente associati a questa zona</ion-label>
      </ng-template>
      <ion-grid *ngIf="buttons">
        <ion-row>
          <ion-col class="ion-align-self-start">
          <ion-button (click)="prev.emit()"  expand="full" >
            <ion-icon name="chevron-back" ></ion-icon>
          </ion-button>
          </ion-col>
          <ion-col class="ion-align-self-center"></ion-col>
          <ion-col class="ion-align-self-end">
          <ion-button [disabled]="thirdStep.invalid" (click)="next.emit()"  expand="full" >
            <ion-icon color="light" name="checkmark"></ion-icon>
          </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      </form>
    `,
  selector: 'pap-third-step-signup-form',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class thirdStepSignupComponent {
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();
  @Input() buttons = true;

  thirdStep: FormGroup = this._formProvider.getForm().get('thirdStep') as FormGroup;
  confiniZone$: Observable<any> = this._store.select(currentZone);
  userTypes$: Observable<any> = this._store.select(currentUserTypes);

  constructor(private _formProvider: FormProvider, private _store: Store<AppState>) {
    this._store.dispatch(loadConfiniZone());
    this._store.dispatch(loadUserTypes());
  }

  reset(): void {
    this.thirdStep.controls['user_type_id'].reset();
  }
}
