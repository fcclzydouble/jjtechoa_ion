import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OaexcutingPage } from './oaexcuting';


@NgModule({
  declarations: [
    OaexcutingPage,
  ],
  imports: [
    PipesModule,
    
    IonicPageModule.forChild(OaexcutingPage),
  ],
})
export class OaexcutingPageModule {}
