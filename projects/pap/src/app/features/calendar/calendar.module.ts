import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import {CalendarPageComponent} from './calendar-page.component';
import {CalendarRoutingModule} from './calendar-routing.module';

@NgModule({
  declarations: [CalendarPageComponent],
  imports: [CommonModule, CalendarRoutingModule, SharedModule],
})
export class CalendarModule {}
