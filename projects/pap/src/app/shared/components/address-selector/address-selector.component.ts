import {BehaviorSubject} from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {Address} from '../../../core/auth/auth.model';

@Component({
  selector: 'pap-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressSelectorComponent implements OnInit, OnChanges {
  @Input() addresses: Address[];
  @Input() other = false;
  @Output() currentAddressEVT: EventEmitter<Address> = new EventEmitter<Address>();
  @Output() currentIndexEVT: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('popover') popover: any;

  currentAddress$: BehaviorSubject<any | null> = new BehaviorSubject<Address | null>(null);
  isOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['addresses'] != null &&
      changes['addresses'].currentValue.length > 0 &&
      this.currentAddress$.value === null
    ) {
      setTimeout(() => {
        this.currentAddress$.next(changes['addresses'].currentValue[0]);
        this.currentAddressEVT.emit(changes['addresses'].currentValue[0]);
        this.currentIndexEVT.emit(0);
      }, 200);
    }
  }

  ngOnInit(): void {
    if (this.addresses != null && this.addresses.length > 0 && this.currentAddress$.value == null) {
      setTimeout(() => {
        this.currentAddress$.next(this.addresses[0]);
        this.currentAddressEVT.emit(this.addresses[0]);
        this.currentIndexEVT.emit(0);
      }, 200);
    }
  }

  popoverClick(idx: number, label?: string): void {
    this.currentIndexEVT.emit(idx);
    this.isOpen$.next(false);
    if (label != null) {
      this.currentAddress$.next({address: 'altro'});
    } else {
      this.currentAddress$.next(this.addresses[idx]);
    }
    this.currentAddressEVT.emit(this.currentAddress$.value);
  }
}
