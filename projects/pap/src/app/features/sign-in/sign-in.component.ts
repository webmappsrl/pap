import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {loadSignIns} from '../../core/auth/state/auth.actions';
import {error, selectAuthState} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';

@Component({
  selector: 'pap-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  public signInForm: FormGroup;
  error$: Observable<string | false | undefined> = this._store.select(error);
  constructor(fb: FormBuilder, private _store: Store<AppState>, private _navCtrl: NavController) {
    this.signInForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this._store.pipe(select(selectAuthState)).subscribe(val => {
      if (val.isLogged) {
        this._navCtrl.navigateRoot('home');
      }
    });
  }

  login(value: any) {
    this._store.dispatch(loadSignIns(value));
  }
}
