import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {AppState} from '../../core/core.state';
import {Store, select} from '@ngrx/store';
import {isDustyMan} from '../../core/auth/state/auth.selectors';
import {AlertController, NavController} from '@ionic/angular';
import {skip, switchMap, take} from 'rxjs/operators';
import {Subscription, Observable} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {lastTicketUpdate, selectReportById} from '../reports/state/reports.selectors';
import {Ticket} from '../reports/state/reports.effects';
import {updateTicket} from '../reports/state/reports.actions';
@Component({
  selector: 'pap-dusty-man-reports-detail',
  templateUrl: './dusty-man-reports-detail.component.html',
  styleUrls: ['./dusty-man-reports-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DustyManReportsDetailComponent {
  private _lastTicketUpdateSub: Subscription = Subscription.EMPTY;

  isDustyMan$ = this._store.pipe(select(isDustyMan));
  lastTicketUpdate$ = this._store.pipe(select(lastTicketUpdate));
  report$: Observable<Ticket>;
  safeUrl: SafeResourceUrl;

  constructor(
    private _store: Store<AppState>,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
    public sanitazer: DomSanitizer,
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
                    await this._alertCtrl.dismiss();
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
      .subscribe(res => {
        this._navCtrl.navigateRoot('/dusty-man-reports');
      });
  }

  ionViewWillLeave(): void {
    this._lastTicketUpdateSub.unsubscribe();
  }

  ticketIsDone(id: any): void {
    const ticket: Partial<Ticket> = {id: +id, status: 'collected'};
    this._store.dispatch(updateTicket({data: ticket}));
  }
}
