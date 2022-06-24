import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {selectHomeState} from '../../features/home/state/home.selectors';
import {selectMenuState} from './state/menu.selectors';
import {closeMenu, loadMenu, openMenu} from './state/menu.actions';
import {buttonAction} from '../../features/home/home.model';
import {AppState} from '../../core/core.state';
import {logout} from '../../core/auth/state/auth.actions';

interface ActionEvt {
  action: string;
  url?: string;
}
@Component({
  selector: 'pap-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnDestroy {
  private _actionEVT$: EventEmitter<ActionEvt> = new EventEmitter<ActionEvt>();
  private _actionEVTSub: Subscription = Subscription.EMPTY;

  menuView$ = this._store.pipe(select(selectMenuState));
  homeView$ = this._store.pipe(select(selectHomeState));

  @Input() startButton: boolean = false;
  @Input() endButton: boolean = false;

  @Input() modal: boolean = false;

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _menuCtrl: MenuController,
    private modalCtrl: ModalController,
  ) {
    this._actionEVTSub = this._actionEVT$.subscribe(evt => {
      if (evt.action === 'open-menu') {
        this._store.dispatch(openMenu());
        this._menuCtrl.open('mainmenu');
        this._menuCtrl.enable(true);
      }
      if (evt.action === buttonAction.NAVIGATION && evt.url) {
        this.closedMenu();
        this._navCtrl.navigateForward(evt.url);
      }
    });
    this._store.dispatch(loadMenu());
  }

  public action(action: string, url?: string): void {
    this._actionEVT$.emit({action, url});
  }
  logout(): void {
    this._store.dispatch(logout());
    this.closedMenu();
  }

  public closedMenu(): void {
    this._menuCtrl.close('mainmenu');
    this._store.dispatch(closeMenu());
  }

  public ngOnDestroy(): void {
    this._actionEVTSub.unsubscribe();
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }
}
