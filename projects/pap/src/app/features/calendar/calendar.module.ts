import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalendarRoutingModule} from './calendar-routing.module';
import {CalendarComponent} from './calendar.component';
import {SharedModule} from '../../shared/shared.module';
import {DateFnsModule} from 'ngx-date-fns';

@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule, CalendarRoutingModule, SharedModule, DateFnsModule],
})
export class CalendarModule {}
