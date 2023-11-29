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
import {AppState} from '../../core/core.state';
import {buttonAction} from '../../features/home/home.model';
import {selectHomeState} from '../../features/home/state/home.selectors';

interface ActionEvt {
  action: string;
  url?: string;
}
@Component({
  selector: 'pap-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent implements OnDestroy {
  private _actionEVT$: EventEmitter<ActionEvt> = new EventEmitter<ActionEvt>();
  private _actionEVTSub: Subscription = Subscription.EMPTY;

  @Input() endButton: boolean = false;
  @Input() modal: boolean = false;
  @Input() startButton: boolean = false;

  homeView$ = this._store.pipe(select(selectHomeState));

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

  action(action: string, url?: string): void {
    this._actionEVT$.emit({action, url});
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  closedMenu(): void {
    this._menuCtrl.close('mainmenu');
  }

  ngOnDestroy(): void {
    this._actionEVTSub.unsubscribe();
  }
}
