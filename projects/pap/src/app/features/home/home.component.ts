import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActionSheetController, NavController} from '@ionic/angular';
import {Store, select, Action} from '@ngrx/store';
import {from} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {buttonAction, buttonInfo} from './home.model';
import {yHomes} from './state/home.actions';
import {selectHomeState} from './state/home.selectors';
import {userRoles} from '../../core/auth/state/auth.selectors';

@Component({
  selector: 'pap-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  homeView$ = this._store.pipe(select(selectHomeState));
  userRoles$ = this._store.pipe(select(userRoles));

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _actionSheetCtrl: ActionSheetController,
  ) {}

  action(button: buttonInfo): void {
    if (button.action === buttonAction.NAVIGATION && button.url) {
      this._navCtrl.navigateForward(button.url);
    }
    if (button.action === buttonAction.ACTION && button.buttons != null) {
      this.userRoles$
        .pipe(
          take(1),
          switchMap(includedRoles => {
            let buttons = button.buttons ?? [];
            buttons = buttons.filter(button =>
              button.roles != null
                ? button.roles?.some((role: string) => includedRoles.includes(role))
                : true,
            );
            return from(
              this._actionSheetCtrl.create({
                cssClass: 'pap-form-selector',
                header: button.label,
                buttons,
                backdropDismiss: true,
              }),
            );
          }),
          switchMap((actionSheet: any) => {
            actionSheet.present();
            return actionSheet.onDidDismiss();
          }),
        )
        .subscribe((res: any) => {
          if (res && res.data && res.data.action) {
            this._navCtrl.navigateForward(res.data.action);
          }
        });
    }
  }

  ionViewWillEnter(): void {
    this._store.dispatch(yHomes());
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: true}));
  }
}
