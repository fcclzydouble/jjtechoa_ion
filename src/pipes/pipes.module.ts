import { IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



import { SpitemTitlePipe } from './spitem-title/spitem-title';
import { RelativeTimePipe } from './relative-time/relative-time';
@NgModule({
	declarations: [SpitemTitlePipe,
    RelativeTimePipe],
	imports: [
		BrowserModule,
		
		IonicModule.forRoot(PipesModule)
		
	],
	exports: [SpitemTitlePipe,
    RelativeTimePipe]
})
export class PipesModule {}
