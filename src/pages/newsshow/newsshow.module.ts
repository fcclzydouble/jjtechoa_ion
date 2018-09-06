import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsShowPage } from './newsshow';

@NgModule({
  declarations: [
    NewsShowPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsShowPage),
  ],
})
export class NewsShowPageModule {}
