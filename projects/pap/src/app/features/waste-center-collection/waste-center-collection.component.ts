import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {loadWasteCenterCollections} from './state/waste-center-collection.actions';
import {selectWasteCenterCollectionState} from './state/waste-center-collection.selectors';
import {WasteCenterCollectionFeature} from './waste-center-collection-model';
import {WasteCenterDetailComponent} from './waste-center-detail/waste-center-detail.component';

@Component({
  selector: 'pap-waste-center-collection',
  templateUrl: './waste-center-collection.component.html',
  styleUrls: ['./waste-center-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WasteCenterCollectionComponent {
  wccView$ = this._store.pipe(select(selectWasteCenterCollectionState));

  constructor(
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private modalController: ModalController,
  ) {
    this._store.dispatch(loadWasteCenterCollections());
  }

  async clickedMarker(feature: WasteCenterCollectionFeature) {
    console.log('------- ~ WasteCenterCollectionComponent ~ feature', feature);

    const modal = await this.modalController.create({
      component: WasteCenterDetailComponent,
      cssClass: 'pap-modal-reduce',
      componentProps: {feature},
      showBackdrop: true,
      backdropDismiss: false,
    });
    return await modal.present();
  }
}
