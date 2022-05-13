import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { headerInfo } from '../../models/headerInfo';
import { AppState } from '../core.state';

const headermock: headerInfo = {
  label: 'portAPPorta',
  // img: 'assets/icons/logo-e.png',
  showBack: false,
  buttonStart: {
    label: '',    
    action: 'open-menu',
    icon:'menu'
  },
  buttonEnd: {
    label: '',    
    action: 'navigate',
    url: 'settings',
    icon:'settings'
  },
};

@Component({
  selector: 'pap-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerView$ = of(headermock);
  constructor(private _store: Store<AppState>, private _navCtrl: NavController) {

  }

  ngOnInit(): void {
  }

  action(action: string, url?: string) {
    console.log("------- ~ HeaderComponent ~ action ~ action, url", action, url);
  }

}
