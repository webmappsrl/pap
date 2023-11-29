import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Calendar, CalendarRow} from '../../../features/calendar/calendar.model';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';

@Component({
  selector: 'pap-form-calendar-select',
  templateUrl: './calendar-select.component.html',
  styleUrls: ['./calendar-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CalendarSelectComponent,
    },
  ],
})
export class CalendarSelectComponent implements ControlValueAccessor {
  @Input() set calendars(calendars: Calendar[]) {
    calendars = calendars.map(c => {
      const calendarKeys = Object.keys(c.calendar).reverse();
      const newCalendar: {[dateOfTrip: string]: CalendarRow[]} = {};
      for (let i = 0; i < 4; i++) {
        const calendarKey = calendarKeys[i] as string;
        if (calendarKey) {
          newCalendar[calendarKey] = c.calendar[calendarKey];
        } else {
          break;
        }
      }
      return {...c, ...{calendar: newCalendar}};
    });

    this.calendars$.next(calendars);
  }

  public calendarForm: FormGroup = new FormGroup({
    calendar: new FormControl(null, [Validators.required]),
    tbType: new FormControl(null, [Validators.required]),
    trashDate: new FormControl('', [Validators.required]),
  });
  calendars$: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  currentSelectionLabel$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  disabled = false;
  onChange = (select: {trashDate: string; tbType: TrashBookType; calendar: Calendar}) => {};
  onTouched = () => {};
  options$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  select: {trashDate: string; tbType: TrashBookType; calendar: Calendar} | null = null;
  touched = false;

  constructor(private _cdr: ChangeDetectorRef) {}

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
    this.calendarForm.valueChanges.subscribe(onChange);
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  writeValue(obj: {trashDate: string; tbType: TrashBookType; calendar: Calendar}): void {
    if ((obj as any) != '') {
      this.calendarForm.setValue(obj);
      this.select = obj;
      this._cdr.detectChanges();
    }
  }
}
