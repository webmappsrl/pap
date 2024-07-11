import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SuccessData} from '../../shared/form/model';
import {PushNotification} from './push-notification.model';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private _http: HttpClient) {}

  getPushNotification(): Observable<PushNotification[]> {
    return (
      this._http.get(`${env.api}/c/${env.companyId}/pushnotification`) as Observable<
        SuccessData<PushNotification[]>
      >
    ).pipe(map(r => r.data));
  }
}
