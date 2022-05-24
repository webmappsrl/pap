import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'pap-waste-center-detail',
  templateUrl: './waste-center-detail.component.html',
  styleUrls: ['./waste-center-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WasteCenterDetailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
