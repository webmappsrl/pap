import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
  onChange = (image: string) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  image: string = '';
  writeValue(image: any): void {
    this.image = image;
    this.onChange(image);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  @Output() imageTaken = new EventEmitter<string>();

  takeImage() {
    navigator.mediaDevices
      .getUserMedia({video: true, audio: false})
      .then(function (stream) {
        console.log(stream);
      })
      .catch(function (err) {
        console.log('An error occurred: ' + err);
      });
  }

  constructor() {}
}
