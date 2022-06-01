import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {map, switchMap} from 'rxjs';
import {User} from '../../core/auth/auth.model';
import {ApiTicket, ApiTicketType} from '../models/apimodels';
import {TicketForm} from '../models/form.model';

const company_id = 4;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  createReport(form: TicketForm, user: User, type: ApiTicketType): ApiTicket {
    return {
      // email: user.email,
      // name: user.name,
      // lastname: this.lastname,
      // address: this.address,
      location: form.step.find(x => x.type == 'location')?.value[0] ?? [],
      ticket_type: type,
      image: form.step.find(x => x.type == 'image')?.value ?? '',
      note: form.step.find(x => x.type == 'textarea')?.value ?? '',
      phone: form.step.find(x => x.type == 'tel')?.value ?? '',
      trash_type_id: form.step.find(x => x.type == 'radio')?.value ?? null,
      user_id: user.id,
    };
  }

  sendReport(report: any) {
    return this.http.post(`${env.api}/api/c/${company_id}/ticket`, report.data);
  }
}
