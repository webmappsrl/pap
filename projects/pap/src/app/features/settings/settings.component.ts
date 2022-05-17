import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {toggleEdit} from './state/settings.actions';
import {SettingsState} from './state/settings.reducer';
import {selectSettingsState} from './state/settings.selectors';

@Component({
  selector: 'pap-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  settingsView$;
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

  constructor(private _store: Store<AppState>) {
    this.settingsView$ = this._store.pipe(select(selectSettingsState));
  }

  ngOnInit(): void {}

  edit(value: boolean) {
    this._store.dispatch(toggleEdit());
  }
}
