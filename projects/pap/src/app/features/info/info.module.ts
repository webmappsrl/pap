import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {InfoRoutingModule} from './info-routing.module';
import {InfoComponent} from './info.component';

@NgModule({
  declarations: [InfoComponent],
  imports: [CommonModule, SharedModule, InfoRoutingModule],
})
export class InfoModule {}
