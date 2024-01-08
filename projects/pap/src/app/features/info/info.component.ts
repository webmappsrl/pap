import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from 'projects/pap/src/environments/environment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'pap-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent {
  imageUrl: '/assets/icons/logo.png';
  pageBody$ = this._http
    .get(`https://portapporta.webmapp.it/api/c/${environment.companyId}/company_page`, {
      responseType: 'text',
    })
    .pipe(map((page: any) => this._sanitizer.bypassSecurityTrustHtml(page)));
  constructor(
    private _sanitizer: DomSanitizer,
    private _http: HttpClient,
  ) {}
}
