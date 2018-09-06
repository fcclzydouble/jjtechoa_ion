import { AppAvailability } from '@ionic-native/app-availability';
import { ToolsProvider } from './../../providers/tools/tools';
import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {ToastController  } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Buffer } from 'buffer';
import {ConfigProvider} from '../../providers/config/config';

declare let startApp:any;

/**
 * Generated class for the NewsShowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsshow',
  templateUrl: 'newsshow.html',
})
export class NewsShowPage {
  

  title = '';
  content = '';
  time = '';
  img = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toolsProvider: ToolsProvider,
    public toastCtrl: ToastController,
    public events: Events,
    public alertCtl: AlertController,
    public platform: Platform,
    public appAvailability: AppAvailability,
    public config:ConfigProvider,
    public httpServicesProvider: HttpServicesProvider) {
    
    this.loadFormData();
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsShowPage');
  }

  public loadFormData() {
    let newsid = this.navParams.get('newsid');
    var url = "/uapi/news/info/" + newsid;
    this.httpServicesProvider.doGetParams(url,{},(result)=>{
      if(result.code == "0") {
        this.title = result.article.title;
        this.time = result.article.createDate;
        this.content = new Buffer(result.articleData.content, "base64").toString();
        //result.articleData.content;
        if(result.article.image != null && result.article.image != '') {
          var imgname = result.article.image;
          imgname = imgname.substring(imgname.indexOf('?'));
          this.img = this.config.apiUrl + '/uapi/news/showimg'  + imgname;
        }
      }
    });
  }

}
