import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { StoreModule } from '@ngrx/store';
import * as fromCalendar from './state/calendar.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CalendarEffects } from './state/calendar.effects';


@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    StoreModule.forFeature(fromCalendar.calendarFeatureKey, fromCalendar.reducer),
    EffectsModule.forFeature([CalendarEffects])
  ]
})
export class CalendarModule { }
