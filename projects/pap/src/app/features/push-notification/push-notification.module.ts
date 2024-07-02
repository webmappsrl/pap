import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import { PushNotificationsPageComponent } from './push-notification-page.component';
import { PushNotificationRoutingModule } from './push-notification-routing.module';

@NgModule({
  declarations: [PushNotificationsPageComponent],
  imports: [CommonModule, PushNotificationRoutingModule, SharedModule],
})
export class PushNotificationModule {}
