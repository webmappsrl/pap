import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {WasteCenterCollectionFeature} from '../waste-center-collection-model';

@Component({
  selector: 'pap-waste-center-detail',
  templateUrl: './waste-center-detail.component.html',
  styleUrls: ['./waste-center-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WasteCenterDetailComponent {
  @Input()
  feature!: WasteCenterCollectionFeature;

  constructor(private _modalCtrl: ModalController) {}

  close() {
    this._modalCtrl.dismiss({
      'dismissed': true,
    });
  }

  navigate() {
    console.log('------- ~ WasteCenterDetailComponent ~ navigate ~ navigate', this.feature);
  }

  website() {
    console.log('------- ~ WasteCenterDetailComponent ~ website ~ website', this.feature);
  }
}
