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
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {currentTrashBookType} from '../state/form.actions';

@Component({
  selector: 'pap-form-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() set options(opts: TrashBookType[]) {
    this.options$.next(opts);
  }

  @Input() set selected(value: TrashBookType | null | undefined) {
    if (value) {
      setTimeout(() => {
        this.writeValue(value);
      }, 0);
    }
  }

  disabled = false;
  isFocused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  onChange = (select: number) => {};
  onTouched = () => {};
  options$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  searchString: string = '';
  select: number = -1;
  touched = false;

  constructor(private _store: Store<AppState>, private _cdr: ChangeDetectorRef) {}

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  onBlur() {
    this.isFocused$.next(false);
  }

  onFocus() {
    this.isFocused$.next(true);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  writeValue(obj: TrashBookType | number): void {
    if ((obj as any) === '') {
      return;
    }
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
    this._cdr.detectChanges();
  }
}
