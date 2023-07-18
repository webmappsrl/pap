import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Store, select} from '@ngrx/store';

import {AppState} from '../../core/core.state';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {ModalController} from '@ionic/angular';
import {TrashBookType} from '../trash-book/trash-book-model';
import {TrashBookTypeComponent} from '../trash-book/trash-book-type/trash-book-type.component';
import {loadCalendars} from './state/calendar.actions';
import {parse} from 'date-fns';
import {selectCalendarState} from './state/calendar.selectors';
import {setTrashBookType} from '../trash-book/state/trash-book.actions';
import {showButtons} from '../../shared/header/state/header.actions';

@Component({
  selector: 'pap-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent {
  calendarView$ = this._store.pipe(select(selectCalendarState));

  constructor(
    private _store: Store<AppState>,
    private _modalController: ModalController,
    private _inAppBrowser: InAppBrowser,
  ) {
    this._store.dispatch(showButtons({show: false}));
  }

  info(tbType: TrashBookType) {
    this._store.dispatch(setTrashBookType({trashBookType: tbType}));
    this._modalController
      .create({
        component: TrashBookTypeComponent,
        showBackdrop: true,
        componentProps: {trashBookType: tbType},
      })
      .then(modal => modal.present());
  }

  openLink(): void {
    this._inAppBrowser.create('https://www.esaspa.it/index.php/rifiuti-ingombranti.html');
  }
}
