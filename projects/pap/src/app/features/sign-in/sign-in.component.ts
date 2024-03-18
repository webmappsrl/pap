import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {loadSignIns} from '../../core/auth/state/auth.actions';
import {error} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {LoginCredentials} from '../../core/auth/auth.model';

@Component({
  selector: 'pap-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  error$: Observable<string | false | undefined | any> = this._store.select(error);
  signInForm: UntypedFormGroup;

  constructor(fb: UntypedFormBuilder, private _store: Store<AppState>) {
    this.signInForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(credential: LoginCredentials): void {
    this._store.dispatch(loadSignIns({credential}));
  }
}
