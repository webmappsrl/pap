import {ChangeDetectionStrategy, Component, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Ticket} from './state/reports.effects';
import {AppState} from '../../core/core.state';
import {Store, select} from '@ngrx/store';
import {isDustyMan, isVip} from '../../core/auth/state/auth.selectors';
import {lastTicketUpdate, selectReportById} from './state/reports.selectors';
import {AlertController, AlertOptions, NavController} from '@ionic/angular';
import {map, skip, switchMap} from 'rxjs/operators';
import {updateTicket} from './state/reports.actions';
import {Observable, Subscription} from 'rxjs';

const DELETE: AlertOptions = {
  cssClass: 'pap-alert',

  header: 'Vuoi cancellare la segnalazione?',
  message: 'questa operazione è irreversibile una volta eseguita',
  buttons: [
    {
      text: 'ok',
      role: 'delete-ok',
      cssClass: 'pap-alert-btn-ok',
    },
    {
      text: 'annulla',
      role: 'annulla',
    },
  ],
};

@Component({
  selector: 'pap-reports-detail',
  templateUrl: './reports-detail.component.html',
  styleUrls: ['./reports-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportsDetailComponent {
  private _alertEVT: EventEmitter<AlertOptions> = new EventEmitter<AlertOptions>();
  private _alertSub: Subscription = Subscription.EMPTY;
  private _lastTicketUpdateSub: Subscription = Subscription.EMPTY;

  isDustyMan$ = this._store.pipe(select(isDustyMan));
  isVip$ = this._store.pipe(select(isVip));
  lastTicketUpdate$ = this._store.pipe(select(lastTicketUpdate));
  report$: Observable<Ticket>;

  constructor(
    private _store: Store<AppState>,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
  ) {
    this.report$ = this._store.pipe(select(selectReportById)) as Observable<Ticket>;

    this._lastTicketUpdateSub = this.lastTicketUpdate$
      .pipe(
        skip(1),
        switchMap(ticket => {
          let opts;
          if (ticket) {
            opts = {
              cssClass: 'success-alert',
              header: 'Aggiornamento Completato',
              message: "L'aggiornamento è andato a buon fine",
              buttons: [
                {
                  text: 'Ok',
                  handler: async () => {
                    this._navCtrl.back();
                  },
                },
              ],
            };
          } else {
            opts = {
              cssClass: 'error-alert',
              header: 'Errore di Aggiornamento',
              message: "Errore durante l'aggiornamento, riprova",
              buttons: ['Ok'],
            };
          }

          return this._alertCtrl.create(opts);
        }),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(res => {});

    this._alertSub = this._alertEVT
      .pipe(
        switchMap(opt => this._alertCtrl.create(opt)),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
        switchMap(val => {
          if (val != null && val.role != null && val.role === 'delete-ok') {
            return this.report$.pipe(
              map(report => {
                const ticket: Partial<Ticket> = {id: +report.id, status: 'deleted'};
                this._store.dispatch(updateTicket({data: ticket}));
                this._navCtrl.back();
              }),
            );
          } else {
            return [];
          }
        }),
      )
      .subscribe();
  }

  deleteTicket(): void {
    this._alertEVT.emit(DELETE);
  }

  getStatusColor(status: string): string {
    let color: string = 'red';
    if (status === 'execute') color = 'green';

    return color;
  }

  ionViewWillLeave(): void {
    this._lastTicketUpdateSub.unsubscribe();
    this._alertSub.unsubscribe();
  }

  ticketIs(id: number, status: string): void {
    const ticket: Partial<Ticket> = {id, status};
    this._store.dispatch(updateTicket({data: ticket}));
  }
}
