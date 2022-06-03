import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketFormConf} from '../../shared/models/form.model';

@Component({
  selector: 'pap-abandonment-ticket',
  templateUrl: './abandonment-ticket.component.html',
  styleUrls: ['./abandonment-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AbandonmentTicketComponent {
  public form: TicketFormConf = {
    cancel: 'forms.abandonment.cancel',
    ticketType: 'abandonment',
    finalMessage: 'forms.abandonment.finalMessage',
    translationsObj: {
      finalMessage: {
        companyName: 'APP.company,',
      },
    },
    pages: 5,
    step: [
      {
        label: 'forms.abandonment.introductionLabel',
        type: 'label',
        mandatory: false,
        translationsObj: {
          label: {
            companyName: 'APP.company,',
          },
        },
      },
      {
        label: 'forms.abandonment.typeLabel',
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
          {
            label: 'types.inerti',
            value: 'Inerti',
            show: true,
          },
          {
            label: 'types.domesticWaste',
            value: 'Rifiuti domestici',
            show: true,
          },
          {
            label: 'types.dangerous',
            value: 'Rifiuti pericolosi',
            show: true,
          },
          {
            label: 'types.other',
            value: 'Altro',
            show: true,
          },
        ],
        type: 'radio',
        mandatory: true,
        value: '',
        recap: 'forms.abandonment.typeRecap',
      },
      {
        label: '',
        type: 'location',
        mandatory: true,
        value: [null, '', [null, '']],
        recap: 'forms.abandonment.addressRecap',
      },
      {
        label: 'forms.abandonment.pictureLabel',
        type: 'image',
        mandatory: true,
        value: '',
        recap: 'forms.abandonment.pictureRecap',
      },
      {
        label: 'forms.abandonment.notesLabel',
        type: 'note',
        mandatory: false,
        value: '',
        recap: 'forms.abandonment.notesRecap',
      },
    ],
  };

  constructor(private navController: NavController) {}

  formFilled(event: any) {
    this.form = event;
  }

  exitPage() {
    this.navController.pop();
  }
}
