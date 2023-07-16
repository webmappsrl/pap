import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppState} from '@capacitor/app';
import {select, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, Observable, map, merge, of} from 'rxjs';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {currentAddress} from '../../map/state/map.selectors';
import {TicketFormConf, TicketFormStep} from '../../models/form.model';
import {currentTrashBookType} from '../state/form.selectors';
import {AlertController} from '@ionic/angular'; // importa AlertController

@Component({
  selector: 'pap-form-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormStatusComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() set currentStep(step: any) {
    this.currentStep$.next(step);
  }
  @Input() conf!: any;
  @Input() pos: any;
  @Input() label!: string | undefined;

  @Output() nextEvt: EventEmitter<void> = new EventEmitter();
  @Output() backEvt: EventEmitter<void> = new EventEmitter();
  @Output() sendDataEvt: EventEmitter<void> = new EventEmitter();
  @Output() undoEvt: EventEmitter<void> = new EventEmitter();
  isValid$: Observable<boolean> = of(false);
  currentStep$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private alertController: AlertController) {}

  ngOnInit(): void {
    this.isValid$ = merge(this.form.valueChanges, this.currentStep$).pipe(
      map(_ => {
        const formControlName = this.currentStep$.value.type;
        const formControl = this.form.controls[formControlName];
        return !formControl.invalid;
      }),
    );
  }

  async presentAlert() {
    const headerText = this.label ? `Vuoi annullare ${this.label}?` : `Vuoi annullare?`;
    const alert = await this.alertController.create({
      cssClass: 'pap-status-alert',
      header: headerText,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.undoEvt.emit();
          },
        },
      ],
    });

    await alert.present();
  }
}
