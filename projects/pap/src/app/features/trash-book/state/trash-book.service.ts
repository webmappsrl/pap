import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TrashBookRow, TrashBookType} from '../trash-book-model';
import {environment as env} from 'projects/pap/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrashBookService {
  constructor(private _http: HttpClient) {}

  getTrashBook(): Observable<TrashBookRow[]> {
    return this._http.get(`${env.api}/c/${env.companyId}/wastes.json`) as Observable<
      TrashBookRow[]
    >;
  }

  getTrashTypes(): Observable<TrashBookType[]> {
    return this._http.get(`${env.api}/c/${env.companyId}/trash_types.json`) as Observable<
      TrashBookType[]
    >;
  }
}
