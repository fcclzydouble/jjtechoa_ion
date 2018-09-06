import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
	declarations: [EmojiPickerComponent],
	imports: [BrowserModule,
		IonicModule.forRoot(ComponentsModule)],
	exports: [EmojiPickerComponent]
})
export class ComponentsModule {}
