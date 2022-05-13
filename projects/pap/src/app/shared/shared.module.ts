import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, IonicModule, HttpClientModule],
  exports: [CommonModule, RouterModule, IonicModule, HttpClientModule],
})
export class SharedModule {}
