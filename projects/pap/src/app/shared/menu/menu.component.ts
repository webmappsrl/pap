import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {logout} from '../../core/auth/state/auth.actions';
import {isLogged} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {buttonAction} from '../../features/home/home.model';
import {selectHomeState} from '../../features/home/state/home.selectors';

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

  @Input() endButton: boolean = false;
  @Input() modal: boolean = false;
  @Input() startButton: boolean = false;

  homeView$ = this._store.pipe(select(selectHomeState));
  isLogged$ = this._store.pipe(select(isLogged));

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _menuCtrl: MenuController,
    private modalCtrl: ModalController,
  ) {
    this._actionEVTSub = this._actionEVT$.subscribe(evt => {
      if (evt.action === 'open-menu') {
        this._menuCtrl.open('mainmenu');
        this._menuCtrl.enable(true);
      }
      if (evt.action === buttonAction.NAVIGATION && evt.url) {
        this.closedMenu();
        this._navCtrl.navigateForward(evt.url);
      }
    });
  }

  public action(action: string, url?: string): void {
    this._actionEVT$.emit({action, url});
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }

  public closedMenu(): void {
    this._menuCtrl.close('mainmenu');
  }

  logout(): void {
    this._store.dispatch(logout());
    this.closedMenu();
  }

  public ngOnDestroy(): void {
    this._actionEVTSub.unsubscribe();
  }
}
