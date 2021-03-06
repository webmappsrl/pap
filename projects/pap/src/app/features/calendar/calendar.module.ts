import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalendarRoutingModule} from './calendar-routing.module';
import {CalendarComponent} from './calendar.component';
import {StoreModule} from '@ngrx/store';
import * as fromCalendar from './state/calendar.reducer';
import * as fromTrashBook from '../trash-book/state/trash-book.reducer';
import {EffectsModule} from '@ngrx/effects';
import {CalendarEffects} from './state/calendar.effects';
import {SharedModule} from '../../shared/shared.module';
import {DateFnsModule} from 'ngx-date-fns';

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    DateFnsModule,
    StoreModule.forFeature(fromCalendar.calendarFeatureKey, fromCalendar.reducer),
    StoreModule.forFeature(fromTrashBook.trashBookFeatureKey, fromTrashBook.reducer),
    EffectsModule.forFeature([CalendarEffects]),
  ],
})
export class CalendarModule {}
