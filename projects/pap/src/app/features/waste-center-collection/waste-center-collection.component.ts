import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {loadWasteCenterCollections} from './state/waste-center-collection.actions';
import {selectWasteCenterCollectionState} from './state/waste-center-collection.selectors';
import {WasteCenterCollectionFeature} from './waste-center-collection-model';

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
    private alertController: AlertController,
  ) {
    this._store.dispatch(loadWasteCenterCollections());
  }

  async clickedMarker(feature: WasteCenterCollectionFeature) {
    const Alert = await this.alertController.create({
      backdropDismiss: false,
      header: feature.properties.name,
      message: this.getHtmlForAlert(feature),
      cssClass: 'pap-waste-center-alert',
      buttons: [
        {
          text: 'Indicazioni stradali', // TODO translation
          cssClass: 'pap-waste-center-alert-btn pap-waste-center-alert-btn-nav',
          handler: () => {
            this.navigate(feature);
          },
        },
        {
          text: 'website', // TODO translation
          cssClass: 'pap-waste-center-alert-btn pap-waste-center-alert-btn-web',
          handler: () => {
            this.website(feature);
          },
        },
        {
          text: 'ok', // TODO translation
          cssClass: 'pap-waste-center-alert-btn pap-waste-center-alert-btn-ok',
          role: 'cancel',
        },
      ],
    });
    return await Alert.present();
  }

  getHtmlForAlert(feature: WasteCenterCollectionFeature) {
    let body = '';
    if (feature?.properties?.picture_url) {
      body += `<ion-img src="${feature?.properties?.picture_url}"></ion-img>`;
    }
    if (feature?.properties?.description != null) {
      body += `<ion-label>${feature?.properties?.description}</ion-label>`;
    }
    if (feature?.properties?.orario != null) {
      body += `<br><br><ion-label color="danger">${feature?.properties?.orario}</ion-label>`;
    }
    return body;
  }

  navigate(feature: WasteCenterCollectionFeature): void {
    window.open(
      'https://maps.google.com/maps?daddr=' +
        feature.geometry.coordinates[1] +
        ',' +
        feature.geometry.coordinates[0] +
        '&navigate=yes',
    );
    this.alertController.dismiss();
  }

  website(feature: WasteCenterCollectionFeature): void {
    window.open(feature.properties.website, '_system');
    this.alertController.dismiss();
  }
}
