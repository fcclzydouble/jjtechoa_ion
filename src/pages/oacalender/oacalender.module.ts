import { NgCalendarModule } from 'ionic2-calendar';
import { IonicPageModule } from 'ionic-angular';
import { OacalenderPage } from './oacalender';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [
    OacalenderPage
  ],
  imports: [
    IonicPageModule.forChild(OacalenderPage),
    NgCalendarModule
  ]
})
export class OacalenderPageModule {}
