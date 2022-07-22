import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

import {of} from 'rxjs';

@Component({
  selector: 'pap-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent {
  public infoView$ = of({
    imageUrl: '/assets/images/logo.jpg',
    pageBody: `PortAPPorta è la nuova applicazione ESA che rende la Raccolta Differenziata ancora più semplice per gli utenti dei Comuni serviti da ESA`,
  });
}
