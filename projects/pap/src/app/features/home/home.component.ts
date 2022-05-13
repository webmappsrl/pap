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
    icon: "fa-calendar",
    url: "calendar"
  },
  {
    label: "map",
    icon: "fa-map",
    url: "map"
  },
  {
    label: "book",
    icon: "fa-check",
    url: "book"
  },
  {
    label: "abandonment",
    icon: "fa-comments",
    url: "abandonment"
  },
  {
    label: "signal",
    icon: "fa-pencil",
    url: "signal"
  },
  {
    label: "trashbook",
    icon: "fa-clipboard",
    url: "trashbook"
  },
  {
    label: "reports",
    icon: "fa-list",
    url: "reports"
  },
  {
    label: "info",
    icon: "fa-info",
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
