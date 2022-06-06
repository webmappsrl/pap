import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {parse} from 'date-fns';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {setTrashBookDetail, setTrashBookType} from '../trash-book/state/trash-book.actions';
import {TrashBookRow, TrashBookType} from '../trash-book/trash-book-model';
import {TrashBookTypeComponent} from '../trash-book/trash-book-type/trash-book-type.component';
import {loadCalendars} from './state/calendar.actions';
import {selectCalendarState} from './state/calendar.selectors';

@Component({
  selector: 'pap-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  calendarView$ = this._store.pipe(select(selectCalendarState));
  constructor(private _store: Store<AppState>, private _modalController: ModalController) {
    this._store.dispatch(showButtons({show: false}));
    this._store.dispatch(loadCalendars());
  }

  ngOnInit(): void {}

  info(tbType: TrashBookType) {
    this._store.dispatch(setTrashBookType({trashBookType: tbType}));
    const modal = this._modalController
      .create({
        component: TrashBookTypeComponent,
        showBackdrop: true,
      })
      .then(modal => modal.present());
  }

  dateOf(dateStr: string) {
    return parse(dateStr, 'yyyy-MM-dd', new Date());
  }
}
