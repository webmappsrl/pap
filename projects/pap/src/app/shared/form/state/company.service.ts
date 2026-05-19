import {Injectable} from '@angular/core';
import {FormJson, Properties, SuccessData} from '../model';
import {Observable} from 'rxjs';
import {environment as env} from 'projects/pap/src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private _http: HttpClient) {}

  getCompaniesData(): Observable<{formJson: FormJson[]; properties: Properties}> {
    return (
      this._http.get(`${env.api}/c/${env.companyId}/companies_data`, {
        params: {id: env.companyId},
      }) as Observable<
        SuccessData<{
          form_json: FormJson[];
          properties: Properties | null;
        }>
      >
    ).pipe(
      map(r => ({
        formJson: r.data.form_json ?? [],
        properties:
          r.data.properties && !Array.isArray(r.data.properties)
            ? r.data.properties
            : ({} as Properties),
      })),
    );
  }
}
