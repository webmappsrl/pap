import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SuccessData, Ticket} from '../../shared/form/model';
@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private _http: HttpClient) {}

  getReports(): Observable<Ticket[]> {
    return (
      this._http.get(`${env.api}/c/${env.companyId}/tickets`) as Observable<SuccessData<Ticket[]>>
    ).pipe(map(r => r.data)) as Observable<Ticket[]>;
  }
}
