import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {map, switchMap} from 'rxjs';

const company_id = 4;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  createReport(form: any) {}

  sendReport(report: any) {
    return this.http.post(`${env.api}/api/c/${company_id}/ticket`, report);
  }
}
