import {KeyValue} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {BehaviorSubject} from 'rxjs';
import {Calendar} from '../../../features/calendar/calendar.model';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {Address} from '../../../core/auth/auth.model';

@Component({
  selector: 'pap-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  @Input() calendars: Calendar[] = [];
  @Input() reverse: boolean = false;
  @Output() selectedTrashTypeEVT: EventEmitter<{
    trashDate: string;
    tbType: TrashBookType;
    calendar: Calendar;
  }> = new EventEmitter<{trashDate: string; tbType: TrashBookType; calendar: Calendar}>();

  currentAddress$: BehaviorSubject<Address | null> = new BehaviorSubject<Address | null>(null);
  currentCalendar$: BehaviorSubject<Calendar | null> = new BehaviorSubject<Calendar | null>(null);
  keyDescOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0;
  };

  constructor(private _inAppBrowser: InAppBrowser, private _cdr: ChangeDetectorRef) {}

  info(trashDate: string, tbType: TrashBookType): void {
    if (this.currentCalendar$.value != null) {
      this.selectedTrashTypeEVT.emit({trashDate, tbType, calendar: this.currentCalendar$.value});
    }
  }

  ngOnInit(): void {
    this.currentCalendar$.next(this.calendars[0]);
    this._cdr.detectChanges();
  }

  openLink(): void {
    this._inAppBrowser.create('https://www.esaspa.it/index.php/rifiuti-ingombranti.html');
  }

  selectAddress(event: any): void {
    this.currentCalendar$.next(event.detail.value);
  }
}
