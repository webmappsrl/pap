import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {MenuController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {from, Observable, of, Subscription, take, withLatestFrom} from 'rxjs';
import {selectHomeState} from '../../features/home/state/home.selectors';
import {selectHeaderState} from './state/header.selectors';
import {closeMenu, loadHeaders, openMenu} from './state/header.actions';
import {buttonAction} from '../../features/home/home.model';
import {AppState} from '../../core/core.state';

interface ActionEvt {
  action: buttonAction;
  url?: string;
}
@Component({
  selector: 'pap-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnDestroy {
  private _actionEVT$: EventEmitter<ActionEvt> = new EventEmitter<ActionEvt>();
  private _actionEVTSub: Subscription = Subscription.EMPTY;
  private _headerViewSub: Subscription = Subscription.EMPTY;
  private _isOpen$: Observable<boolean> = from(this._menuCtrl.isOpen('mainmenu'));

  headerView$ = this._store.pipe(select(selectHeaderState));
  homeView$ = this._store.pipe(select(selectHomeState));

  @Input() startButton: boolean = false;
  @Input() endButton: boolean = false;

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _menuCtrl: MenuController,
  ) {
    this._headerViewSub = this.headerView$
      .pipe(withLatestFrom(this._isOpen$))
      .subscribe(([openAction, isOpen]) => {
        if (openAction && !isOpen) {
          this._menuCtrl.enable(true, 'mainmenu');
          this._menuCtrl.open('mainmenu');
        }
        if (!openAction && isOpen) {
          this._menuCtrl.enable(false, 'mainmenu');
          this._menuCtrl.close('mainmenu');
        }
      });

    this._actionEVTSub = this._actionEVT$
      .pipe(withLatestFrom(this._isOpen$))
      .subscribe(([evt, isOpen]) => {
        if (evt.action === 'open-menu') {
          console.log('------- ~ HeaderComponent ~ action ~ isOpen', isOpen);
          if (!isOpen) {
            this._store.dispatch(openMenu());
          } else {
            this._store.dispatch(closeMenu());
          }
        }
        if (evt.action === buttonAction.NAVIGATION && evt.url) {
          this._navCtrl.navigateForward(evt.url);
        }
      });
    this._store.dispatch(loadHeaders());
  }

  public action(action: buttonAction, url?: string): void {
    this._actionEVT$.emit({action, url});
  }

  public closedMenu(): void {
    this._store.dispatch(closeMenu());
  }

  public ngOnDestroy(): void {
    this._headerViewSub.unsubscribe();
    this._actionEVTSub.unsubscribe();
  }
}
