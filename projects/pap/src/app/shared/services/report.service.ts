import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {User} from '../../core/auth/auth.model';
import {ApiTicket, ApiTicketType} from '../models/apimodels';
import {TicketFormConf} from '../models/form.model';

const company_id = 4;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  createReport(ticketFormConf: TicketFormConf, user: User, type: ApiTicketType): ApiTicket {
    return {
      location: ticketFormConf.step.find(x => x.type == 'location')?.value[0] ?? [],
      ticket_type: type,
      image: ticketFormConf.step.find(x => x.type == 'image')?.value ?? '',
      note: ticketFormConf.step.find(x => x.type == 'note')?.value ?? '',
      phone: ticketFormConf.step.find(x => x.type == 'phone')?.value ?? '',
      trash_type_id: ticketFormConf.step.find(x => x.type == 'trash_type_id')?.value ?? null,
      user_id: user.id,
    };
  }

  sendReport(report: any) {
    return this.http.post(`${env.api}/api/c/${company_id}/ticket`, report.data);
  }
}
