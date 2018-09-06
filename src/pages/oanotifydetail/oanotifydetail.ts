import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';

/**
 * Generated class for the OanotifydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oanotifydetail',
  templateUrl: 'oanotifydetail.html',
})
export class OanotifydetailPage {

  notice;
  meet;
  isStyle;

  constructor(public platform: Platform,  
              public params: NavParams, 
              public viewCtrl: ViewController, 
              public navCtrl: NavController,
              public httpServicesProvider: HttpServicesProvider){
     
      console.log("OanotifydetailPage -- this.params： " + this.params);
      this.notice = this.params.get("notice");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OanotifydetailPage');
    this.isRead(this.notice.id, this.notice.nId);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  isRead(id, nId){
    let url = '/uapi/oa/notice/isRead/' + id + '/' + nId;
    this.httpServicesProvider.doPost(url, null, (result)=>{
        if(0 == result.code){

        }else{
          console.log(result.error);
        }
    });
  }
}
