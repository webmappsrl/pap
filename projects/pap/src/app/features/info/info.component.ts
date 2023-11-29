import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from 'projects/pap/src/environments/environment';
import {of} from 'rxjs';

@Component({
  selector: 'pap-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent {
  infoView$ = of({
    imageUrl: '/assets/icons/logo.png',
    pageBody: this._sanitizer.bypassSecurityTrustHtml(
      environment?.config?.resources?.company_page ?? '',
    ),
  });

  constructor(private _sanitizer: DomSanitizer) {}
}
