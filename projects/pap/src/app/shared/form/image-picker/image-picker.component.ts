import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {ActionSheetController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
@Component({
  selector: 'pap-form-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ImagePickerComponent,
    },
  ],
})
export class ImagePickerComponent implements ControlValueAccessor {
  disabled = false;
  image$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  onChange = (image: string) => {};
  onTouched = () => {};
  touched = false;

  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _cdr: ChangeDetectorRef,
  ) {}

  async getImage(source: CameraSource): Promise<void> {
    try {
      let permStatus = await Camera.checkPermissions();

      const image = await Camera.getPhoto({
        quality: 10,
        resultType: CameraResultType.DataUrl,
        source,
        correctOrientation: true,
      });
      if (image.dataUrl != null) {
        this.image$.next(image.dataUrl);
        this.writeValue(image.dataUrl);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  async imageSheet(): Promise<void> {
    const actionSheet = await this._actionSheetCtrl.create({
      cssClass: 'pap-image-picker-action-sheet',
      buttons: [
        {
          text: 'Chiudi',
          role: 'cancel',
        },
        {
          text: 'Camera',
          handler: () => this.getImage(CameraSource.Camera),
        },
        {
          text: 'Galleria',
          handler: () => this.getImage(CameraSource.Photos),
        },
      ],
    });

    await actionSheet.present();
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  writeValue(image: string): void {
    this.image$.next(image);
    this.onChange(image);
  }
}
