import { Injectable } from "@angular/core";
import { FormJson, SuccessData } from "../model";
import { Observable } from "rxjs";
import {environment as env} from 'projects/pap/src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private _http: HttpClient) {}

  getFormJson(): Observable<FormJson[]> {
    return (
      this._http.get(`${env.api}/c/${env.companyId}/form_json`) as Observable<
        SuccessData<FormJson[]>
      >
    ).pipe(map(r => r.data));
  }
}
