

import { ComponentsModule } from './../components/components.module';
import { DirectivesModule } from './../directives/directives.module';
import { PipesModule } from './../pipes/pipes.module';


import { OanotifymodalPageModule } from '../pages/oanotifymodal/oanotifymodal.module';
import { OanotifydetailPageModule } from './../pages/oanotifydetail/oanotifydetail.module';
import { OanotifyPageModule } from './../pages/oanotify/oanotify.module';
import { ChatPageModule } from './../pages/chat/chat.module';
import { ChatmainPageModule } from './../pages/chatmain/chatmain.module';
import { OadoingPageModule } from './../pages/oadoing/oadoing.module';
import { LoginPageModule } from './../pages/login/login.module';
import { OaselfPageModule } from './../pages/oaself/oaself.module';
import { OaworkPageModule } from './../pages/oawork/oawork.module';
import { MeetingjoinPageModule } from './../pages/meetingjoin/meetingjoin.module';
import { OacalenderPageModule } from './../pages/oacalender/oacalender.module';
import { OacalendareventmodalPageModule } from './../pages/oacalendareventmodal/oacalendareventmodal.module';
import { NewsShowPageModule } from './../pages/newsshow/newsshow.module';
import { NewsPageModule } from './../pages/news/news.module';
import { OaexcutingPageModule } from './../pages/oaexcuting/oaexcuting.module';
import { AddresslistPageModule } from './../pages/addresslist/addresslist.module';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { MyApp } from './app.component';


//import { OaexcutingPage } from './../pages/oaexcuting/oaexcuting';
//import { NewsShowPage } from './../pages/newsshow/newsshow';
//import { NewsPage } from './../pages/news/news';
//import { OacalenderPage, CalendarModalContentPage } from './../pages/oacalender/oacalender';
//import { MeetingjoinPage } from './../pages/meetingjoin/meetingjoin';
//import { OaworkPage } from '../pages/oawork/oawork';
//import { OaselfPage } from '../pages/oaself/oaself';
//import { LoginPage } from './../pages/login/login';
//import { OadoingPage } from './../pages/oadoing/oadoing';
//import { ChatmainPage } from './../pages/chatmain/chatmain';
//import { ChatPage } from './../pages/chat/chat';
//import { OanotifyPage } from '../pages/oanotify/oanotify';
//import { OanotifydetailPage } from '../pages/oanotifydetail/oanotifydetail';




import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler,Content } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigProvider } from '../providers/config/config';
import { StorageProvider } from '../providers/storage/storage';
import { HttpServicesProvider } from '../providers/http-services/http-services';
import { ToolsProvider } from '../providers/tools/tools';
import { IonicStorageModule } from '@ionic/storage';
import { JPush } from '@jiguang-ionic/jpush';
import { JMessagePlugin } from '@jiguang-ionic/jmessage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Device } from '@ionic-native/device';
import { BackButtonProvider } from '../providers/back-button/back-button';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';
import { EmojiProvider } from '../providers/emoji/emoji';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { QRScanner } from "@ionic-native/qr-scanner";
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { AppAvailability } from '@ionic-native/app-availability';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule,
    AddresslistPageModule,
    OaexcutingPageModule,
    NewsPageModule,
    NewsShowPageModule,
    OacalenderPageModule,
    MeetingjoinPageModule,
    OaworkPageModule,
    OaselfPageModule,
    LoginPageModule,
    OadoingPageModule,
    ChatmainPageModule,
    ChatPageModule,
    OanotifyPageModule,
    OacalendareventmodalPageModule,
    OanotifydetailPageModule,
    OanotifymodalPageModule,
    IonicStorageModule.forRoot({
      name: 'MyApp',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    IonicModule.forRoot(MyApp,{
      menuType: 'push',
      tabsHideOnSubPages: 'true', //隐藏全部子页面 tabs
      backButtonText: '' ,//*配置返回按钮
      backButtonIcon: 'arrow-dropleft-circle' ,
      iconMode:'ios',//  在整个应用程序中为所有图标使用的模式。可用选项："ios"，"md"
      mode:'ios'//在整个应用程序中使用的模式。

    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage
      
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    StorageProvider,
    HttpServicesProvider,
    JPush,
    JMessagePlugin,
    Device,
    Camera,
    File,
    QRScanner,
    CallNumber,
    SMS,
    Geolocation,
    ThemeableBrowser,
    FileOpener,
    FileTransfer,
    AppAvailability,
    Media,
    PhotoViewer,
    LocalNotifications,
    ToolsProvider,
    BackButtonProvider,
    EmojiProvider,
    { provide: LOCALE_ID, useValue: 'zh-CN' }
  ]
})
export class AppModule {}
