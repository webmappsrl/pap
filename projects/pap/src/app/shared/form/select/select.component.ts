import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {TrashBookRow, TrashBookType} from '../../../features/trash-book/trash-book-model';

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

  @Input() set options(opts: TrashBookType[]) {
    this.options$.next(opts);
  }
  onChange = (select: number) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  constructor() {}
  writeValue(obj: TrashBookRow): void {
    this.select = obj.id;
    this.onChange(obj.id);
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
}
