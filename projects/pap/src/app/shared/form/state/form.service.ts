import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env, environment} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {Ticket, SuccessResponse} from '../model';
import {TicketFormConf} from '../../models/form.model';
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private _http: HttpClient) {}

  sendTicket(ticket: Ticket): Observable<SuccessResponse> {
    return this._http.post(
      `${env.api}/c/${environment.companyId}/ticket`,
      ticket,
    ) as Observable<SuccessResponse>;
  }

  getTicketFormsConfig(): Observable<{[key: string]: TicketFormConf}> {
    return this._http.get(
      `${env.api}/c/${environment.companyId}/ticket-forms-config`,
    ) as Observable<{[key: string]: TicketFormConf}>;
  }
}
