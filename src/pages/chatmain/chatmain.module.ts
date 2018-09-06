import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatmainPage } from './chatmain';

@NgModule({
  declarations: [
    ChatmainPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatmainPage),
  ],
})
export class ChatmainPageModule {}
