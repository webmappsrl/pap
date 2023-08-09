import {ChangeDetectionStrategy, Component, EventEmitter, ViewEncapsulation} from '@angular/core';
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
import {BehaviorSubject, Observable} from 'rxjs';
import {Calendar} from './calendar.model';
import {take, filter} from 'rxjs/operators';

@Component({
  selector: 'pap-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CalendarPageComponent {
  calendarView$ = this._store.pipe(select(selectCalendarState));
  currentAddress$: BehaviorSubject<Calendar> = new BehaviorSubject<any>(null);

  constructor(
    private _store: Store<AppState>,
    private _modalController: ModalController,
    private _inAppBrowser: InAppBrowser,
  ) {
    this._store.dispatch(loadCalendars());
    this._store.dispatch(showButtons({show: false}));
    this.calendarView$
      .pipe(
        filter(f => f != null),
        take(1),
      )
      .subscribe(calendarView => {
        if (calendarView != null && calendarView.calendars != null) {
          this.currentAddress$.next(calendarView.calendars[0]);
        }
      });
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

  selectAddress(event: any): void {
    this.currentAddress$.next(event.detail.value);
  }
}
