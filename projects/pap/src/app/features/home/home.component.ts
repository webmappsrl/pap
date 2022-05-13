import { NavController } from '@ionic/angular';
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {buttonInfo} from '../../models/buttonInfo';
import {yHomes} from './state/home.actions';
import {selectHomeState} from './state/home.selectors';

@Component({
  selector: 'pap-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  homeView$ = this._store.pipe(select(selectHomeState));
  constructor(private _store: Store<AppState>,    private _navCtrl: NavController) {
    this._store.dispatch(yHomes());
  }

  public gotoPage(url?: string) {
    console.log("------- ~ HomeComponent ~ gotoPage ~ url", url);
    // this.navCtrl.navigateForward(url);
  }
}
