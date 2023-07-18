import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AlertController, IonInput, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, map, Observable, switchMap, Subscription, filter} from 'rxjs';
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
export class FormComponent implements OnDestroy {
  @ViewChild('focusInput') focusInput!: IonInput;
  formError$: Observable<any> = this._store.pipe(select(ticketError));
  formSuccess$: Observable<any> = this._store.pipe(select(ticketSuccess));
  formLoading$: Observable<boolean> = this._store.pipe(select(ticketLoading));
  currentTrashbookType$: Observable<TrashBookType | undefined> = this._store.pipe(
    select(currentTrashBookType),
  );
  trashBookTypesOpts$!: Observable<TrashBookType[]>;
  private _ticketSub: Subscription = Subscription.EMPTY;
  @Input() set ticketFormConf(ticketFormConf: TicketFormConf) {
    this.ticketFormConf$.next(ticketFormConf);
    ticketFormConf.step.forEach(step => {
      const validators: ValidatorFn[] = [];
      if (step.required) {
        validators.push(Validators.required);
      }

      const formControl = new FormControl('', validators);
      this.ticketForm.addControl(step.type, formControl);
      this.trashBookTypesOpts$ = this._store.pipe(
        select(trashBookTypes),
        map(trashBookTypes =>
          trashBookTypes.filter(t => t.showed_in[ticketFormConf.ticketType] === true),
        ),
      );
    });
    const ticketTypeControl = new FormControl(ticketFormConf.ticketType);
    this.ticketForm.addControl('ticket_type', ticketTypeControl);
  }

  pos$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  ticketForm: FormGroup = new FormGroup({});
  ticketFormConf$: BehaviorSubject<TicketFormConf | null> =
    new BehaviorSubject<TicketFormConf | null>(null);
  alertEvt$: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
  ) {
    this.alertEvt$.pipe(switchMap(obj => this._alertCtrl.create(obj)));
    this._ticketSub = this.formSuccess$
      .pipe(
        filter(v => v != null),
        switchMap(success => {
          const header = `${
            success ? 'Prenotazione avvenuta con successo' : 'Errore nella prenotazione'
          }`;
          const message = `${
            success
              ? 'Puoi visualizzarla nella sezione "i miei ticket".'
              : "Si è verificato un errore durante l'invio del tuo ticket. Per favore, prova di nuovo"
          }`;
          return this._alertCtrl.create({
            cssClass: `pap-status-alert-${success ? 'confirmation' : 'erro'}`,
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

  ngOnDestroy(): void {
    this._ticketSub.unsubscribe();
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

  sendData(): void {
    this._store.dispatch(sendTicket({ticket: this.ticketForm.value}));
  }
}
