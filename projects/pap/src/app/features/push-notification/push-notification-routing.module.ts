import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { PushNotificationsPageComponent } from './push-notification-page.component';

const routes: Routes = [{path: '', component: PushNotificationsPageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PushNotificationRoutingModule {}
