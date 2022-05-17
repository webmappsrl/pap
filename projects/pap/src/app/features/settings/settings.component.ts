import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'pap-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  editMode: boolean = false;
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

  constructor() {}

  ngOnInit(): void {}

  edit(value: boolean) {
    this.editMode = value;
  }
}
