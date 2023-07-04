import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Ticket} from '../../shared/form/model';
import {environment as env} from 'projects/pap/src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private _http: HttpClient) {}

  getReports(): Observable<Ticket[]> {
    return (this._http.get(`${env.api}/api/c/${env.companyId}/tickets`) as Observable<any>).pipe(
      map(r => r.data as Ticket[]),
    );
  }
}
