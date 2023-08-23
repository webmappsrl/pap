import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppState} from '@capacitor/app';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import {TrashBookRow, TrashBookType} from '../../../features/trash-book/trash-book-model';
import {currentTrashBookType} from '../state/form.actions';

@Component({
  selector: 'pap-form-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  options$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  select: number = -1;
  searchString: string = '';
  isFocused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() set selected(value: TrashBookType | null | undefined) {
    if (value) {
      this.writeValue(value);
    }
  }

  @Input() set options(opts: TrashBookType[]) {
    this.options$.next(opts);
  }
  onChange = (select: number) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  constructor(private _store: Store<AppState>, private _cdr: ChangeDetectorRef) {}
  writeValue(obj: TrashBookType | number): void {
    if (typeof obj === 'number') {
      const currentObj = this.options$.value.filter(f => f.id === obj);
      obj = (currentObj.length > 0 ? currentObj[0] : undefined) as TrashBookType;
    }
    if (obj) {
      this.select = obj.id;
      this._store.dispatch(currentTrashBookType({currentTrashBookType: obj}));
      this.onChange(obj.id);
    } else {
      this.select = -1;
      this._store.dispatch(currentTrashBookType({currentTrashBookType: undefined}));
      this._cdr.detectChanges();
    }
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  onFocus() {
    this.isFocused$.next(true);
  }

  onBlur() {
    this.isFocused$.next(false);
  }
}
