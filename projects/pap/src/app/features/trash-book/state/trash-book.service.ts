import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TrashBookRow} from '../trash-book-model';

@Injectable({
  providedIn: 'root',
})
export class TrashBookService {
  constructor(private _http: HttpClient) {}

  getTrashBook(): Observable<TrashBookRow[]> {
    return this._http.get('http://portapporta.webmapp.it/api/c/4/wastes.json') as Observable<
      TrashBookRow[]
    >;
  }
}
