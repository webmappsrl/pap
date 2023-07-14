import {ActionSheetController, NavController} from '@ionic/angular';
import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Pipe} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {yHomes} from './state/home.actions';
import {selectHomeState} from './state/home.selectors';
import {showButtons} from '../../shared/header/state/header.actions';
import {buttonAction, buttonInfo} from './home.model';
import {from, switchMap, take} from 'rxjs';

@Component({
  selector: 'pap-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  homeView$ = this._store.pipe(select(selectHomeState));

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _actionSheetCtrl: ActionSheetController,
  ) {
    this._store.dispatch(yHomes());
  }

  public action(button: buttonInfo) {
    if (button.action === buttonAction.NAVIGATION && button.url) {
      this._navCtrl.navigateForward(button.url);
    }
    if (button.action === buttonAction.ACTION && button.buttons != null) {
      from(
        this._actionSheetCtrl.create({
          cssClass: 'pap-form-selector',
          header: button.label,
          buttons: button.buttons,
          backdropDismiss: true,
        }),
      )
        .pipe(
          take(1),
          switchMap(actionSheet => {
            actionSheet.present();
            return actionSheet.onDidDismiss();
          }),
        )
        .subscribe(res => {
          console.log(res);
          this._navCtrl.navigateForward(res.data.action);
        });
    }
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: true}));
  }
}
