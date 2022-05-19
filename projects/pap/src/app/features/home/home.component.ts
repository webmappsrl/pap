import {NavController} from '@ionic/angular';
import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {yHomes} from './state/home.actions';
import {selectHomeState} from './state/home.selectors';
import {showButtons} from '../../shared/header/state/header.actions';
import {buttonAction} from './home.model';

@Component({
  selector: 'pap-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  homeView$ = this._store.pipe(select(selectHomeState));
  constructor(private _store: Store<AppState>, private _navCtrl: NavController) {
    this._store.dispatch(yHomes());
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: true}));
  }

  public action(action: string, url?: string) {
    if (action === buttonAction.NAVIGATION && url) {
      this._navCtrl.navigateForward(url);
    }
  }
}
