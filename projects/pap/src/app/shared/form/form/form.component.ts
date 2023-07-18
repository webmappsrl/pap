import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AlertController, IonInput, NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {AppState} from '../../../core/core.state';
import {trashBookTypes} from '../../../features/trash-book/state/trash-book.selectors';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {TicketFormConf, TicketFormStep} from '../../models/form.model';
import {resetTicket, sendTicket} from '../state/form.actions';
import {
  currentTrashBookType,
  ticketError,
  ticketLoading,
  ticketSuccess,
} from '../state/form.selectors';

@Component({
  selector: 'pap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent {
  @Input() set ticketFormConf(ticketFormConf: TicketFormConf) {
    this.ticketFormConf$.next(ticketFormConf);
    ticketFormConf.step.forEach(step => {
      const validators: ValidatorFn[] = [];
      if (step.required) {
        validators.push(Validators.required);
      }

      const formControl = new UntypedFormControl('', validators);
      this.ticketForm.addControl(step.type, formControl);
      this.trashBookTypesOpts$ = this._store.pipe(
        select(trashBookTypes),
        map(trashBookTypes =>
          trashBookTypes.filter(t => t.showed_in[ticketFormConf.ticketType] === true),
        ),
      );
    });
    const ticketTypeControl = new UntypedFormControl(ticketFormConf.ticketType);
    this.ticketForm.addControl('ticket_type', ticketTypeControl);
  }

  @ViewChild('focusInput') focusInput!: IonInput;

  alertEvt$: EventEmitter<any> = new EventEmitter<any>();
  currentTrashbookType$: Observable<TrashBookType | undefined> = this._store.pipe(
    select(currentTrashBookType),
  );
  formError$: Observable<any> = this._store.pipe(select(ticketError));
  formLoading$: Observable<boolean> = this._store.pipe(select(ticketLoading));
  formSuccess$: Observable<any> = this._store.pipe(select(ticketSuccess));
  pos$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  recap$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ticketForm: UntypedFormGroup = new UntypedFormGroup({});
  ticketFormConf$: BehaviorSubject<TicketFormConf | null> =
    new BehaviorSubject<TicketFormConf | null>(null);
  trashBookTypesOpts$!: Observable<TrashBookType[]>;

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
  ) {
    this.alertEvt$.pipe(switchMap(obj => this._alertCtrl.create(obj)));
  }

  backStep(): void {
    if (this.pos$.value === 0) this.close();
    else {
      const backStep = (this.pos$.value as number) - 1;
      this.pos$.next(backStep);
    }
  }

  close(): void {
    this._store.dispatch(resetTicket());
    console.log('close form');
    this.recap$.next(false);
    setTimeout(() => {
      this._navCtrl.navigateRoot('home');
    }, 200);
  }

  isValid(currentStep: TicketFormStep): boolean {
    const formControlName = currentStep.type;
    const formControl = this.ticketForm.controls[formControlName];
    return !formControl.invalid;
  }

  log(val: any) {
    console.log(val);
  }

  nextStep(): void {
    const nextStep = (this.pos$.value as number) + 1;
    if (nextStep < (this.ticketFormConf$.value as TicketFormConf).step.length) {
      this.pos$.next(nextStep);
    }
    setTimeout(() => {
      if (this.focusInput && this.focusInput.setFocus) {
        this.focusInput.setFocus();
      }
    }, 100);
  }

  recap(): void {
    this.recap$.next(true);
  }

  sendData(): void {
    this.recap$.next(false);
    this._store.dispatch(sendTicket({ticket: this.ticketForm.value}));
  }
}
