import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';
import {loadTrashBooks} from '../../features/trash-book/state/trash-book.actions';
import {AppState} from '../core.state';

@Component({
  selector: 'pap-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  constructor(private _store: Store<AppState>) {
    this._store.dispatch(loadTrashBooks());
  }
}
