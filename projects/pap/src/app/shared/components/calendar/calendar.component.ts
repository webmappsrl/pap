import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';

import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {BehaviorSubject} from 'rxjs';
import {Calendar} from '../../../features/calendar/calendar.model';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {Address} from '../../../features/settings/settings.model';
import {KeyValue} from '@angular/common';

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

  currentCalendar$: BehaviorSubject<Calendar> = new BehaviorSubject<any>(null);
  currentAddress$: BehaviorSubject<Address> = new BehaviorSubject<any>(null);

  constructor(private _inAppBrowser: InAppBrowser, private _cdr: ChangeDetectorRef) {}

  info(trashDate: string, tbType: TrashBookType): void {
    this.selectedTrashTypeEVT.emit({trashDate, tbType, calendar: this.currentCalendar$.value});
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
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0;
  };
  keyDescOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };
}
