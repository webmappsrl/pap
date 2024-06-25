import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Ticket} from './state/reports.effects';
import {AppState} from '../../core/core.state';
import {Store, select} from '@ngrx/store';
import {isDustyMan} from '../../core/auth/state/auth.selectors';
import {lastTicketUpdate} from './state/reports.selectors';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {skip, switchMap} from 'rxjs/operators';
import {updateTicket} from './state/reports.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pap-reports-detail',
  templateUrl: './reports-detail.component.html',
  styleUrls: ['./reports-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportsDetailComponent {
  private _lastTicketUpdateSub: Subscription = Subscription.EMPTY;

  @Input() report!: Ticket;

  isDustyMan$ = this._store.pipe(select(isDustyMan));
  lastTicketUpdate$ = this._store.pipe(select(lastTicketUpdate));

  constructor(
    private _store: Store<AppState>,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
    private _modalCtrl: ModalController,
  ) {
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
                    await this._modalCtrl.dismiss();
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
  }

  deleteTicket(): void {
    this._alertCtrl.create({
      cssClass: 'pap-alert',
      header: 'Cancella Segnalazione',
      message: 'Sei sicuro di voler cancellare la segnalazione?',
      buttons: [
        {
          text: 'Conferma',
          role: 'ok',
          handler: async () => {
            const ticket: Partial<Ticket> = {id: +this.report.id, status: 'deleted'};
            this._store.dispatch(updateTicket({data: ticket}));
            await this._modalCtrl.dismiss();
          },
        },
        {
          text: 'Annulla',
        },
      ]
    }).then(alert => {
      alert.present();
    }).catch(error => {
      console.error('Error presenting alert:', error);
    });
  }

  ionViewWillLeave(): void {
    this._lastTicketUpdateSub.unsubscribe();
  }

  ticketIsDone(): void {
    const ticket: Partial<Ticket> = {id: +this.report.id, status: 'execute'};
    this._store.dispatch(updateTicket({data: ticket}));
  }
}
