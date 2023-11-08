import {KeyValue} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
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
  @ViewChild('popover') popover: any;

  currentAddress$: BehaviorSubject<Address | null> = new BehaviorSubject<Address | null>(null);
  currentCalendar$: BehaviorSubject<Calendar | null> = new BehaviorSubject<Calendar | null>(null);
  isOpen: boolean = false;
  selectedIdxItem$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  selectedIdxBtn$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  keyDescOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0;
  };

  constructor(private _inAppBrowser: InAppBrowser, private _cdr: ChangeDetectorRef) {}

  info(trashDate: string, tbType: TrashBookType, idxItem: number, idxTrashType: number): void {
    this.selectedIdxItem$.next(idxItem);
    this.selectedIdxBtn$.next(idxTrashType);
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

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  selectAddress(event: any): void {
    this.currentCalendar$.next(event.detail.value);
  }

  selectPopoverAddress(index: number): void {
    const selectedCalendar = this.calendars[index];
    this.currentCalendar$.next(selectedCalendar);
    this.isOpen = false;
    this.popover.dismiss();
  }
}
