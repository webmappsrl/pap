import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { buttonInfo } from '../../models/buttonInfo';

const mock: buttonInfo[] = [
  {
    label: "company",
    img: 'assets/icons/logo-e.png',
    url: "company"
  },
  {
    label: "calendar",
    icon: "md-calendar",
    url: "calendar"
  },
  {
    label: "map",
    icon: "map",
    url: "map"
  },
  {
    label: "disruption",
    icon: "md-create",
    url: "disruption"
  },
  {
    label: "abandonment",
    icon: "md-chatbubbles",
    url: "abandonment"
  },
  {
    label: "book",
    icon: "md-checkmark",
    url: "book"
  },
  {
    label: "trashbook",
    icon: "md-clipboard",
    url: "trashbook"
  },
  {
    label: "reports",
    icon: "md-list",
    url: "reports"
  },
  {
    label: "info",
    icon: "md-information",
    url: "info"
  }

];

@Component({
  selector: 'pap-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  public buttons: buttonInfo[] = mock;

  constructor(
    private navCtrl: NavController
  ) {

  }

  public gotoPage(url: string) {
    console.log("------- ~ HomeComponent ~ gotoPage ~ url", url);
    // this.navCtrl.navigateForward(url);
  }

}
