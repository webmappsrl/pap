import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'pap-form-picture-picker',
  templateUrl: './picture-picker.component.html',
  styleUrls: ['./picture-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PicturePickerComponent {
  @Output() imageTaken = new EventEmitter<string>();

  public picture: string = '';
  public text: string = '';

  imageSheet() {}
}
