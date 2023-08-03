import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env, environment} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {Ticket} from '../model';
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private _http: HttpClient) {}

  sendTicket(ticket: Ticket): Observable<any> {
    return this._http.post(`${env.api}/c/${environment.companyId}/ticket`, ticket);
  }
}
