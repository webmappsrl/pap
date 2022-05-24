import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {AppState} from '../../core/core.state';
import {loadWasteCenterCollections} from './state/waste-center-collection.actions';
import {selectWasteCenterCollectionState} from './state/waste-center-collection.selectors';

@Component({
  selector: 'pap-waste-center-collection',
  templateUrl: './waste-center-collection.component.html',
  styleUrls: ['./waste-center-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WasteCenterCollectionComponent implements OnInit {
  public wccView$ = this._store.pipe(select(selectWasteCenterCollectionState));

  constructor(private _store: Store<AppState>, private _navCtrl: NavController) {
    this._store.dispatch(loadWasteCenterCollections());
  }

  ngOnInit(): void {}
}
