import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {LocationService} from '../../../services/location.service';
// import {Geolocation} from '@awesome-cordova-plugins/geolocation/ngx';

const TOAST_DURATION = 2500;
const MESSAGES_GETOUTOFBOUNDS = 'Al momento sei al di fuori dei confini';
const MESSAGES_GENERICERROR = 'Si è verificato un errore. Riprova tra qualche minuto';

@Component({
  selector: 'pap-form-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LocationComponent {
  @Output() positionSet = new EventEmitter<number[]>();
  @Output() addressSet = new EventEmitter<string>();

  public myPosition: number[] = [];
  public myPositionString: string = '';

  constructor(
    // private geolocation: Geolocation,
    private translateService: TranslateService,
    private toastCtrl: ToastController,
    private locationService: LocationService,
  ) {}

  setAddress(address: string) {
    this.myPositionString = address;
    this.addressSet.emit(address);
  }

  addressOnChange(event: any) {
    if (event?.target && typeof event.target.value === 'string') {
      this.setAddress(event.target.value);
    }
  }
  mapClick(ev: number[]) {
    this.setPosition(ev);
  }

  setPosition(coords: number[]) {
    if (this.locationService.isInsideMap(coords)) {
      this.myPosition = coords;
      this.positionSet.emit(coords);
      this.locationService.getAddress(coords).subscribe(
        res => {
          this.setAddress(res as string);
        },
        (error: any) => {
          this.setAddress(`${coords[0]} ${coords[1]}`);
        },
      );
    } else {
      this.sendToast(this.translateService.instant(MESSAGES_GETOUTOFBOUNDS));
    }
  }

  async getLocation() {
    try {
      // const resp = await this.geolocation.getCurrentPosition();
      // console.log('------- ~ LocationComponent ~ getLocation ~ resp', resp);
      // const respCoord = [resp.coords.latitude, resp.coords.longitude];
      // this.setPosition(respCoord);
    } catch (error) {
      this.sendToast(this.translateService.instant(MESSAGES_GENERICERROR));
    }
  }

  async sendToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: TOAST_DURATION,
    });
    toast.present();
  }
}
