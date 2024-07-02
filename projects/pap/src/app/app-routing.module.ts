import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full', // if no route redirect to home
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'trashbook',
    loadChildren: () =>
      import('./features/trash-book/trash-book.module').then(m => m.TrashBookModule),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
  },
  {path: 'info', loadChildren: () => import('./features/info/info.module').then(m => m.InfoModule)},
  {
    path: 'sign-in',
    loadChildren: () => import('./features/sign-in/sign-in.module').then(m => m.SignInModule),
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./features/sign-up/sign-up.module').then(m => m.SignUpModule),
  },
  {
    path: 'waste-center-collection',
    loadChildren: () =>
      import('./features/waste-center-collection/waste-center-collection.module').then(
        m => m.WasteCenterCollectionModule,
      ),
  },
  {
    path: 'info-ticket',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/info-ticket/info-ticket.module').then(m => m.InfoTicketModule),
  },
  {
    path: 'ticket-reservation',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/ticket-reservation/ticket-reservation.module').then(
        m => m.TicketReservationModule,
      ),
  },
  {
    path: 'ticket-vip-reservation',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/ticket-vip-reservation/ticket-vip-reservation.module').then(
        m => m.TicketVipReservationModule,
      ),
  },
  {
    path: 'abandonment-ticket',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/abandonment-ticket/abandonment-ticket.module').then(
        m => m.AbandonmentTicketModule,
      ),
  },
  {
    path: 'report-ticket',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/report-ticket/report-ticket.module').then(m => m.ReportTicketModule),
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/calendar/calendar.module').then(m => m.CalendarModule),
  },
  {
    path: 'push-notification',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/push-notification/push-notification.module').then(m => m.PushNotificationModule),
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
  },
  {
    path: 'dusty-man-reports',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dusty-man-reports/dusty-man-reports.module').then(
        m => m.DustyManReportsModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'home', // all no defined route redirect to home
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
