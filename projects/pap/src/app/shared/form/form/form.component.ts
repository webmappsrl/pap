import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AlertController, IonInput, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {AppState} from '../../../core/core.state';
import {TicketFormConf, TicketFormStep} from '../../models/form.model';
import {resetTicket, sendTicket} from '../state/form.actions';
import {ticketError, ticketLoading, ticketSuccess} from '../state/form.selectors';

const POSITION_INDEX = 0;
const ADDRESS_INDEX = 1;
const REGEX_NUMBER = /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
const REGEX_EMAIL =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const TOAST_DURATION = 3000;

// const MESSAGES_WRONGCODE = 'Codice errato. Controlla di averlo inserito correttamente o torna indietro per controllare che la mail che hai inserito sia corretta';
// const MESSAGES_INVALIDCODE = 'Devi inserire un codice valido prima di procedere';
const MESSAGES_EXIT = 'Si, esci';
const MESSAGES_CONTINUE = 'Continua';

@Component({
  selector: 'pap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent {
  focusInput!: IonInput;
  formError$: Observable<any> = this._store.pipe(select(ticketError));
  formSuccess$: Observable<any> = this._store.pipe(select(ticketSuccess));
  formLoading$: Observable<boolean> = this._store.pipe(select(ticketLoading));
  @Input() set ticketFormConf(ticketFormConf: TicketFormConf) {
    this.ticketFormConf$.next(ticketFormConf);
    ticketFormConf.step.forEach(step => {
      const validators: ValidatorFn[] = [];
      if (step.mandatory) {
        validators.push(Validators.required);
      }

      const formControl = new FormControl('', validators);
      this.ticketForm.addControl(step.type, formControl);
    });
    const ticketTypeControl = new FormControl(ticketFormConf.ticketType);
    this.ticketForm.addControl('ticket_type', ticketTypeControl);
    console.log(ticketTypeControl.value);
  }

  pos$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  recap$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
  }

  backStep() {
    if (this.pos$.value === 0) this.sendExit();
    else {
      const backStep = (this.pos$.value as number) - 1;
      this.pos$.next(backStep);
    }
  }

  close(): void {
    this._store.dispatch(resetTicket());
    setTimeout(() => {
      this._navCtrl.navigateRoot('home');
    }, 0);
  }

  isValid(currentStep: TicketFormStep): boolean {
    const formControlName = currentStep.type;
    const formControl = this.ticketForm.controls[formControlName];
    console.log(formControl.value);
    return !formControl.invalid;
  }

  nextStep() {
    const nextStep = (this.pos$.value as number) + 1;
    if (nextStep < (this.ticketFormConf$.value as TicketFormConf).step.length) {
      this.pos$.next(nextStep);
    }
  }

  recap(): void {
    this.recap$.next(true);
  }

  sendData() {
    this.recap$.next(false);
    this._store.dispatch(sendTicket({ticket: this.ticketForm.value}));
  }

  sendExit() {
    this._store.dispatch(resetTicket());
    this._navCtrl.navigateRoot('home');
  }
  saveImage(image: any) {
    console.log(image);
  }
}
