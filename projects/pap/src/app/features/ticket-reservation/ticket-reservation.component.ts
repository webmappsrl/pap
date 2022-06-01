import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'pap-ticket-reservation',
  templateUrl: './ticket-reservation.component.html',
  styleUrls: ['./ticket-reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicketReservationComponent implements OnInit {
  public form = {
    cancel: 'forms.bookService.cancel',
    finalMessage: 'forms.bookService.finalMessage',
    translationsObj: {
      finalMessage: {
        companyName: 'APP.company,',
      },
    },
    pages: 6,
    step: [
      {
        label: 'forms.bookService.introductionLabel',
        type: 'label',
        mandatory: false,
        translationsObj: {
          label: {
            companyName: 'APP.company,',
          },
        },
      },
      {
        label: 'forms.bookService.typeLabel',
        options: [
          {
            label: 'types.ingombranti',
            value: 'Ingombranti',
            show: true,
          },
          {
            label: 'types.RAEE',
            value: 'RAEE',
            show: true,
          },
          {
            label: 'types.verde',
            value: 'Verde',
            show: true,
          },
        ],
        extraOptions: [
          {
            label: 'types.pile',
            value: 'Pile',
            show: true,
          },
          {
            label: 'types.farmaci',
            value: 'Farmaci',
            show: true,
          },
        ],
        type: 'radio',
        mandatory: true,
        value: '',
        recap: 'forms.bookService.typeRecap',
      },
      {
        label: '',
        type: 'location',
        mandatory: true,
        value: [null, '', [null, '']],
        recap: 'forms.bookService.addressRecap',
      },
      {
        label: 'forms.bookService.pictureLabel',
        type: 'image',
        mandatory: false,
        value: '',
        recap: 'forms.bookService.pictureRecap',
      },
      {
        label: 'forms.bookService.notesLabel',
        type: 'textarea',
        mandatory: false,
        value: '',
        recap: 'forms.bookService.notesRecap',
      },
      {
        label: 'forms.bookService.phoneLabel',
        type: 'tel',
        mandatory: false,
        value: '',
        recap: 'forms.bookService.phoneRecap',
      },
    ],
  };

  constructor(private navController: NavController) {}

  ngOnInit(): void {}

  formFilled(event: any) {
    this.form = event;
  }

  exitPage() {
    this.navController.pop();
  }
}
