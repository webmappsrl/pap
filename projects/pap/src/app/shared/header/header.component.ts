import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  AfterViewInit,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Subscription} from 'rxjs';
import {isLogged} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {buttonAction} from '../../features/home/home.model';
import {selectHomeState} from '../../features/home/state/home.selectors';
import {closeMenu, loadHeaders, openMenu} from './state/header.actions';
import {selectHeaderState} from './state/header.selectors';
import {deliveredNotifications} from '../../features/push-notification/state/push-notification.selectors';
import {NavigationEnd, Router} from '@angular/router';
import { filter } from 'rxjs/operators';

interface ActionEvt {
  action: string;
  replaceUrl?: boolean;
  url?: string;
}

@Component({
  selector: 'pap-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private _actionEVT$: EventEmitter<ActionEvt> = new EventEmitter<ActionEvt>();
  private _actionEVTSub: Subscription = Subscription.EMPTY;
  private _deliveredNotificationSub: Subscription = Subscription.EMPTY;
  private _routerEventsSub: Subscription = Subscription.EMPTY;

  @Input() endButton: boolean = false;
  @Input() modal: boolean = false;
  @Input() startButton: boolean = false;

  deliveredNotifications$ = this._store.pipe(select(deliveredNotifications));
  hasDeliveredNotifications$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  headerView$ = this._store.pipe(select(selectHeaderState));
  homeView$ = this._store.pipe(select(selectHomeState));
  isLogged$ = this._store.pipe(select(isLogged));
  needBack$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _store: Store<AppState>,
    private _router: Router,
    private _navCtrl: NavController,
    private _menuCtrl: MenuController,
    private _modalCtrl: ModalController,
    private _cdr: ChangeDetectorRef,
  ) {
    this._store.dispatch(loadHeaders());

    this._actionEVTSub = this._actionEVT$.subscribe(evt => {
      if (evt.action === 'open-menu') {
        this._store.dispatch(openMenu());
        this._menuCtrl.open('mainmenu');
        this._menuCtrl.enable(true);
      }
      if (evt.action === buttonAction.NAVIGATION && evt.url) {
        this.closedMenu();
        if (evt.replaceUrl) {
          this._navCtrl.navigateRoot(evt.url);
        } else {
          this._navCtrl.navigateForward(evt.url);
        }
      }
    });

    this._routerEventsSub = this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this._needBack();
      });
  }

  action(action: string, url?: string, replaceUrl?: boolean): void {
    this._actionEVT$.emit({action, url, replaceUrl});
  }

  closeModal(): void {
    this._modalCtrl.dismiss();
  }

  closedMenu(): void {
    this._menuCtrl.close('mainmenu');
    this._store.dispatch(closeMenu());
  }

  ngAfterViewInit(): void {
    this._deliveredNotificationSub = this.deliveredNotifications$.subscribe(dnotifications => {
      this.hasDeliveredNotifications$.next((dnotifications && dnotifications.length > 0) || false);
      this._cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this._actionEVTSub.unsubscribe();
    this._deliveredNotificationSub.unsubscribe();
  }

  private _needBack():void{
    const currentUrl = this._router.url;
    const subPath = ['push-notification', 'reports/'];
    const needBack =  subPath.some(element => currentUrl.includes(element));
    this.needBack$.next(needBack);
  }
}
