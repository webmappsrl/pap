import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {toggleEdit} from './state/settings.actions';
import {selectSettingsState} from './state/settings.selectors';

@Component({
  selector: 'pap-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  settingsView$ = this._store.pipe(select(selectSettingsState));
  profile: any = {};

  appVersion = '1.2.3';

  languages = [
    {
      label: 'Inglese',
      value: 'en',
    },
    {
      label: 'Italiano',
      value: 'it',
    },
  ];

  constructor(private _store: Store<AppState>) {}

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
  }

  edit(value: boolean) {
    this._store.dispatch(toggleEdit());
  }
}
