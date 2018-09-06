import { UserInfo } from './../module/user_vo';
import { OaworkPage } from './../pages/oawork/oawork';
import { Component,ViewChild  } from '@angular/core';
import { Platform ,Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { ToolsProvider } from './../providers/tools/tools';
import { LoginPage } from './../pages/login/login';
import {MenuController  } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
import { JMessagePlugin, JMUserInfo, JMError } from '@jiguang-ionic/jmessage';
import { Events } from 'ionic-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = '';
  public pages = [
    {title:'实名认证',component: OaworkPage,icon:'ios-contact-outline'},
    {title:'附近的人',component: OaworkPage,icon:'ios-pin-outline'},
    {title:'扫一扫',component: OaworkPage,icon:'ios-qr-scanner-outline'},
    //{title:'音乐闹钟',component: OaworkPage,icon:'ios-alarm-outline'},
    //{title:'驾驶模式',component: OaworkPage,icon:'ios-car-outline'},
    {title:'个性换肤',component: OaworkPage,icon:'ios-shirt-outline'}
   
  ];
  
  public footerBtn = [
    {id:'yj',title:'夜间',icon:'ios-moon-outline'},
    //{title:'设置',icon:'ios-settings-outline'},
    {id:'tc',title:'退出',icon:'ios-power-outline'},
  ];
  @ViewChild(Nav) nav: Nav;
  placeholder = '../assets/imgs/tuser.png';
  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };

  

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public jpush: JPush,
    public jmessage: JMessagePlugin,
    public events: Events,
    public menuController: MenuController,
    public toolsProvider: ToolsProvider) {
      events.subscribe("logout",(r)=>{
        this.appLogout();
      })

      toolsProvider.getUserData().then((r)=>{
        if(r != null) {
          this.rootPage = TabsPage;
          this.userinfo.username = r.username;
          this.userinfo.userfullname = r.userfullname;
          console.log("MyApp login ok=" + JSON.stringify(r));
          
        }else {
          console.log("MyApp login fail");
          this.rootPage = LoginPage;
        }

      })
      

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      jpush.init().then((res)=>{
        console.log("jpush.init() ok=" + res);
        
        
      }).catch((err)=>{
        console.log("jpush.init() err=" + err);
        
      });
      jpush.setDebugMode(true);
      this.jmessage.init({ isOpenMessageRoaming: true });
      this.jmessage.setDebugMode({enable: true});
      

    });

    


   

   
  }

 public openPage(page) {
    this.nav.push(page.component);
  }

  public appLogout() {
    this.toolsProvider.clearUserData();
    this.menuController.close();
    this.jmessage.logout();
    this.rootPage = LoginPage;

  }

  public oaset(page) {
    if(page.id == 'tc') {
     this.events.publish("logout","logout");
    }



  }

  public isLogin() :boolean {
    return this.toolsProvider.isLogin();
   
  }

  public getUserInfo() {
    return this.toolsProvider.getUserInfo();
  }

  
}
