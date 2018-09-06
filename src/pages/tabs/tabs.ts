import { BackButtonProvider } from './../../providers/back-button/back-button';

import { Component,ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { OaworkPage } from '../oawork/oawork';
import { OaselfPage } from '../oaself/oaself';
import { Events } from 'ionic-angular';
import { Platform,Tabs } from "ionic-angular";
import {NewsPage} from '../news/news'




import { ToolsProvider } from './../../providers/tools/tools';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabRef: Tabs;
  tabOaWork = OaworkPage;
  tabDiscovery = NewsPage;
  tabSelf = OaselfPage;
  public infototal:number = 0;

  
 

  constructor(
    public navCtrl: NavController,
    public toolsProvider : ToolsProvider,
    public backButtonService: BackButtonProvider,
    private platform: Platform,
    public events:Events) {
    
    events.subscribe("infonums:tab",(r)=>{
      this.infototal = r;
    });

    platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(this.tabRef);
    });
  }
}
