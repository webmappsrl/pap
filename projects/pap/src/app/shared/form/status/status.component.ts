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
import {BehaviorSubject, Observable, merge, of} from 'rxjs';
import {AlertController} from '@ionic/angular';
import {map} from 'rxjs/operators';

@Component({
  selector: 'pap-form-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormStatusComponent implements OnInit {
  @Input() set currentStep(step: any) {
    this.currentStep$.next(step);
  }

  @Input() conf!: any;
  @Input() form!: FormGroup;
  @Input() pos: any;
  @Output() backEvt: EventEmitter<void> = new EventEmitter();
  @Output() nextEvt: EventEmitter<void> = new EventEmitter();
  @Output() sendDataEvt: EventEmitter<void> = new EventEmitter();
  @Output() undoEvt: EventEmitter<void> = new EventEmitter();

  currentStep$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isValid$: Observable<boolean> = of(false);

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
    const headerText = this.conf.label ? `Vuoi annullare ${this.conf.label}?` : `Vuoi annullare?`;
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
