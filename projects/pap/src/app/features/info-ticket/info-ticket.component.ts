import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'pap-info-ticket',
  templateUrl: './info-ticket.component.html',
  styleUrls: ['./info-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
        value: '',
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
        value: '',
        recap: 'forms.info.phoneRecap',
      },
    ],
  };

  constructor(private navController: NavController) {}

  ngOnInit(): void {}

  formFilled(event: any) {
    this.form = event;
    console.log('------- ~ InfoTicketComponent ~ formFilled ~ this.form', this.form);
  }

  exitPage() {
    this.navController.pop();
  }
}
