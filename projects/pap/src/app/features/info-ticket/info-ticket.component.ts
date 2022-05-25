import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'pap-info-ticket',
  templateUrl: './info-ticket.component.html',
  styleUrls: ['./info-ticket.component.scss'],
})
export class InfoTicketComponent implements OnInit {
  public form = {
    cancel: 'forms.info.cancel',
    finalMessage: 'forms.info.finalMessage',
    translationsObj: {
      finalMessage: {
        companyName: 'APP.company',
      },
    },
    pages: 3,
    step: [
      {
        label: 'forms.info.introductionLabel',
        type: 'label',
        mandatory: false,
        translationsObj: {
          label: {
            companyName: 'APP.company',
          },
        },
      },
      {
        label: 'forms.info.infoLabel',
        type: 'textarea',
        mandatory: true,
        default: '',
        recap: 'forms.info.infoRecap',
        translationsObj: {
          label: {
            companyName: 'APP.company',
          },
        },
      },
      {
        label: 'forms.info.phoneLabel',
        type: 'tel',
        mandatory: false,
        default: '',
        recap: 'forms.info.phoneRecap',
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {}
}
