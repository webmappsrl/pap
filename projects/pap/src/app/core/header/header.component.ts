import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {MenuController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {headerInfo} from './header.model';
import {AppState} from '../core.state';
import {selectHomeState} from '../../features/home/state/home.selectors';
import {selectHeaderState} from './state/header.selectors';
import {closeMenu, loadHeaders, openMenu} from './state/header.actions';
import {buttonAction} from '../../features/home/home.model';

@Component({
  selector: 'pap-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  headerView$;
  homeView$;

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _menu: MenuController,
  ) {
    this.homeView$ = this._store.pipe(select(selectHomeState));
    this.headerView$ = this._store.pipe(select(selectHeaderState));
    this.headerView$.subscribe(x => this.openMenu(x.header.isMenuOpen));
    this._store.dispatch(loadHeaders());
  }

  async openMenu(openAction: boolean) {
    const isOpen = await this._menu.isOpen('mainmenu');
    if (openAction && !isOpen) {
      this._menu.enable(true, 'mainmenu');
      this._menu.open('mainmenu');
    }
    if (!openAction && isOpen) {
      this._menu.enable(false, 'mainmenu');
      this._menu.close('mainmenu');
    }
  }

  async action(action: buttonAction, url?: string) {
    if (action === 'open-menu') {
      const isOpen = await this._menu.isOpen('mainmenu');
      console.log('------- ~ HeaderComponent ~ action ~ isOpen', isOpen);
      if (!isOpen) {
        this._store.dispatch(openMenu());
      } else {
        this._store.dispatch(closeMenu());
      }
    }
    if (action === buttonAction.NAVIGATION && url) {
      this._navCtrl.navigateForward(url);
    }
  }

  closedMenu() {
    this._store.dispatch(closeMenu());
  }
}
