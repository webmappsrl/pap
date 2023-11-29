import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Camera} from '@awesome-cordova-plugins/camera/ngx';
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
    Camera,
  ],
})
export class ImagePickerComponent implements ControlValueAccessor {
  disabled = false;
  image$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  onChange = (image: string) => {};
  onTouched = () => {};
  touched = false;

  constructor(
    private _camera: Camera,
    private _actionSheetCtrl: ActionSheetController,
    private _cdr: ChangeDetectorRef,
  ) {}

  getImage(type: any): void {
    let source = this._camera.PictureSourceType.CAMERA;

    if (type == 1) source = this._camera.PictureSourceType.SAVEDPHOTOALBUM;

    this._camera
      .getPicture({
        quality: 10,
        destinationType: this._camera.DestinationType.DATA_URL,
        sourceType: source,
        encodingType: this._camera.EncodingType.JPEG,
        mediaType: this._camera.MediaType.PICTURE,
      })
      .then(
        imageData => {
          const image = `data:image/jpeg;base64,${imageData}`;
          this.image$.next(image);
          this.writeValue(image);
          this._cdr.detectChanges();
        },
        err => {
          console.log(err);
        },
      );
  }

  imageSheet(): void {
    let actionSheet = this._actionSheetCtrl.create({
      cssClass: 'pap-image-picker-action-sheet',
      buttons: [
        {
          text: 'Chiudi',
          role: 'cancel',
        },
        {
          text: 'Camera',
          handler: () => this.getImage(0),
        },
        {
          text: 'Galleria',
          handler: () => this.getImage(1),
        },
      ],
    });

    actionSheet.then(a => {
      a.present();
    });
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
