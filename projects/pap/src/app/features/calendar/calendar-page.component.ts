import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Store, select} from '@ngrx/store';

import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {ModalController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, filter, take} from 'rxjs/operators';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {setTrashBookType} from '../trash-book/state/trash-book.actions';
import {TrashBookType} from '../trash-book/trash-book-model';
import {TrashBookTypeComponent} from '../trash-book/trash-book-type/trash-book-type.component';
import {Calendar} from './calendar.model';
import {loadCalendars} from './state/calendar.actions';
import {selectCalendarState} from './state/calendar.selectors';

@Component({
  selector: 'pap-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
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
    this.calendarView$
      .pipe(
        filter(f => f != null),
        take(1),
      )
      .subscribe(calendarView => {
        if (calendarView != null && calendarView.calendars != null) {
          this.currentAddress$.next(calendarView.calendars[event.detail.value]);
        }
      });
  }
}
