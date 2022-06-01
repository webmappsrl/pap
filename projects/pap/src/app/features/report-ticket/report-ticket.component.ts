import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketForm} from '../../shared/models/form.model';

@Component({
  selector: 'pap-report-ticket',
  templateUrl: './report-ticket.component.html',
  styleUrls: ['./report-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportTicketComponent implements OnInit {
  public form: TicketForm = {
    cancel: 'forms.disruption.cancel',
    finalMessage: 'forms.disruption.finalMessage',
    translationsObj: {
      finalMessage: {
        companyName: 'APP.company,',
      },
    },
    pages: 5,
    step: [
      {
        label: 'forms.disruption.introductionLabel',
        type: 'label',
        mandatory: false,
        translationsObj: {
          label: {
            companyName: 'APP.company,',
          },
        },
      },
      {
        label: 'forms.disruption.typeLabel',
        options: [
          {
            label: 'types.organico',
            value: 'Organico',
            show: true,
          },
          {
            label: 'types.carta',
            value: 'Carta, Cartone e Tetrapak',
            show: true,
          },
          {
            label: 'types.multimateriale',
            value: 'Multimateriale leggero',
            show: true,
          },
          {
            label: 'types.vetro',
            value: 'Vetro',
            show: true,
          },
          {
            label: 'types.verde',
            value: 'Verde',
            show: true,
          },
          {
            label: 'types.indifferenziato',
            value: 'Indifferenziato',
            show: true,
          },
        ],
        extraOptions: [],
        type: 'radio',
        mandatory: true,
        value: '',
        recap: 'forms.disruption.typeRecap',
      },
      {
        label: '',
        type: 'location',
        mandatory: true,
        value: [null, '', [null, '']],
        recap: 'forms.disruption.addressRecap',
      },
      {
        label: 'forms.disruption.pictureLabel',
        type: 'image',
        mandatory: false,
        value: '',
        recap: 'forms.disruption.pictureRecap',
      },
      {
        label: 'forms.disruption.notesLabel',
        type: 'textarea',
        mandatory: false,
        value: '',
        recap: 'forms.disruption.notesRecap',
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
