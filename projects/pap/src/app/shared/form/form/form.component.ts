import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AlertController, IonInput, NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {AppState} from '../../../core/core.state';
import {selectCalendarState} from '../../../features/calendar/state/calendar.selectors';
import {trashBookTypes} from '../../../features/trash-book/state/trash-book.selectors';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {confiniZone} from '../../map/state/map.selectors';
import {TicketFormConf, TicketFormStep} from '../../models/form.model';
import {resetTicket, sendTicket} from '../state/form.actions';
import {
  currentTrashBookType,
  ticketError,
  ticketLoading,
  ticketSuccess,
} from '../state/form.selectors';
import {UpdateUser} from '../../../core/auth/state/auth.actions';
import {user} from '../../../core/auth/state/auth.selectors';

@Component({
  selector: 'pap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent implements OnDestroy {
  private _ticketSub: Subscription = Subscription.EMPTY;
  private _user$ = this._store.select(user);

  @Input() set ticketFormConf(ticketFormConf: TicketFormConf) {
    this.ticketFormConf$.next(ticketFormConf);
    ticketFormConf.step.forEach(step => {
      const validators: ValidatorFn[] = [];
      if (step.required) {
        validators.push(Validators.required);
      }
      let value = '';
      if (step.type === 'phone') {
        this._user$.pipe(take(1)).subscribe(user => {
          if (user != null && user['phone_number'] != null) {
            value = user['phone_number'];
          }
        });
      }
      const formControl = new UntypedFormControl(value, validators);
      this.ticketForm.addControl(step.type, formControl);
      if (step.type === 'location') {
        this.ticketForm.addControl('address', new UntypedFormControl('', validators));
        this.ticketForm.addControl('city', new UntypedFormControl('', validators));
        this.ticketForm.addControl('house_number', new UntypedFormControl(''));
      }

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
  calendars$ = this._store.pipe(select(selectCalendarState)).pipe(
    filter(c => c != null),
    map(calendarView => calendarView.calendars),
  );
  confiniZone$: Observable<any> = this._store.select(confiniZone);
  currentTrashbookType$: Observable<TrashBookType | undefined> = this._store.pipe(
    select(currentTrashBookType),
  );
  formError$: Observable<any> = this._store.pipe(select(ticketError));
  formLoading$: Observable<boolean> = this._store.pipe(select(ticketLoading));
  formSuccess$: Observable<any> = this._store.pipe(select(ticketSuccess));
  pos$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  ticketForm: UntypedFormGroup = new UntypedFormGroup({});
  ticketFormConf$: BehaviorSubject<TicketFormConf | null> =
    new BehaviorSubject<TicketFormConf | null>(null);
  trashBookTypesOpts$!: Observable<TrashBookType[]>;

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
  ) {
    this.currentTrashbookType$.subscribe(val => console.log(val));
    this.alertEvt$.pipe(switchMap(obj => this._alertCtrl.create(obj)));
    this._ticketSub = this.formSuccess$
      .pipe(
        filter(v => v != null),
        switchMap(success => {
          const label = this.ticketFormConf$.value?.label || 'Prenotazione';
          const header = `${
            success ? `${label} avvenuta con successo` : `Errore nella prenotazione`
          }`;
          const message = `${
            success
              ? 'Puoi visualizzarla nella sezione "i miei ticket".'
              : 'Errore durante l’invio - Si è verificato un errore durante l’invio del tuo ticket. Per favore, prova di nuovo.'
          }`;
          return this._alertCtrl.create({
            cssClass: `pap-status-alert-${success ? 'confirmation' : 'error'}`,
            header,
            message,
            buttons: [
              {
                text: 'X',
                role: 'close',
                cssClass: `pap-status-alert-${success ? 'confirmation' : 'error'}-close`,
              },
            ],
          });
        }),
        switchMap(alert => {
          alert.present();
          return alert.onDidDismiss();
        }),
      )
      .subscribe(_ => {
        this.close();
      });
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
    setTimeout(() => {
      this._navCtrl.navigateRoot('home');
    }, 200);
  }

  isValid(currentStep: TicketFormStep): boolean {
    const formControlName = currentStep.type;
    const formControl = this.ticketForm.controls[formControlName];
    return !formControl.invalid;
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

  ngOnDestroy(): void {
    this._ticketSub.unsubscribe();
  }

  sendData(): void {
    let formValue = this.ticketForm.value;
    if (formValue['phone'] != null && this.ticketForm.controls['phone'].dirty) {
      const updates = {phone_number: formValue['phone']};
      this._store.dispatch(UpdateUser({updates}));
    }
    if (formValue['calendar_trash_type_id'] != null) {
      const calendar = formValue['calendar_trash_type_id'];
      delete formValue['calendar_trash_type_id'];
      if (calendar.calendar.address.id != null) {
        formValue['address_id'] = calendar.calendar.address.id;
      }
      if (calendar.trashDate != null) {
        formValue['missed_withdraw_date'] = calendar.trashDate;
      }
      if (calendar.tbType != null) {
        formValue['trash_type_id'] = calendar.tbType.id;
      }
    }
    this._store.dispatch(sendTicket({ticket: formValue}));
  }
}
