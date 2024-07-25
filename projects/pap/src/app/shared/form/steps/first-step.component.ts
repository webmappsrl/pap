import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormGroupDirective, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import { Observable } from 'rxjs';
import { FormJson } from '../model';
import { Store } from '@ngrx/store';
import { selectFormJsonByStep } from '../state/company.selectors';
import { BaseCustomForm } from '../base-custom-form.component';

@Component({
  selector: 'pap-first-step-signup-form',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class firstStepSignupComponent extends BaseCustomForm implements OnInit {
  @Input() buttons = true;
  @Input() disable: string[] = [];
  @Output() next: EventEmitter<void> = new EventEmitter<void>();

  firstStep: UntypedFormGroup;
  formJson$: Observable<FormJson[] | undefined> = this._store.select(selectFormJsonByStep(1));

  constructor(private _parent: FormGroupDirective, private _store: Store, fb: UntypedFormBuilder) {
    super(fb);
  }

  isRequired(field: FormJson): boolean{
    return this.isFieldRequired(field);
  }

  ngOnInit(): void {
    this.firstStep = this._parent.form.get('firstStep') as UntypedFormGroup;
  }
}
