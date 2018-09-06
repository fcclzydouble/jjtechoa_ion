import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ToolsProvider } from '../../providers/tools/tools';
import { OanotifydetailPage } from '../oanotifydetail/oanotifydetail';
import { OanotifymodalPage } from '../oanotifymodal/oanotifymodal';

/**
 * Generated class for the OanotifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oanotify',
  templateUrl: 'oanotify.html',
})
export class OanotifyPage {

  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };
  
  public noticelist = [];

  public meet;

  public pageparam_gw = {
    "page": 1,
    "limit":10,
    "total":0,
    "type":1
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public httpServicesProvider: HttpServicesProvider,
              public events: Events,
              public toolsProvider: ToolsProvider) {

                //
                this.toolsProvider.getUserData().then((r)=>{
                  if(r != null) {
                    this.userinfo.username = r.username;
                    this.userinfo.userfullname = r.userfullname;
                    this.loadNotice();
                  }else {
                    this.events.publish("logout","logout");
                  }
                })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OanotifyPage');
  }


  //加载数据
  public loadNotice() {
    let url:string = "/uapi/oa/notice/listUser?sName=" + this.userinfo.username;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        this.noticelist = result.page.list;
        this.pageparam_gw.total = result.page.totalPage;
      }
    })
  }

  public loadMeetInfo(meetId){
    let url:string = "/uapi//oa/meet/info/" + meetId;
    this.httpServicesProvider.doGetParams(url, null, (result)=>{
      console.log("meet:" + result);
      if(result.code == "0") {
        this.meet = result.actMeetEntity;
      }
    })
  }

  openModal(notice) {
    console.log("openModal:" + notice.meetId);
    let modal = this.modalCtrl.create(OanotifydetailPage, {"notice": notice, "meet": this.meet});
    modal.onDidDismiss(data => {
      console.log("onDidDismiss");
      // setTimeout(() => {
        this.loadNotice();
      // }, 2000);
    });
    modal.present();

    /*this.navCtrl.push(OanotifydetailPage,{
      "notice": notice
    });*/
  }

   /*openModal(notice) {
    console.log("openModal:" + notice.meetId);
   let modal = this.modalCtrl.create(OanotifydetailPage, {"notice": notice, "meet": this.meet});
    modal.present();
    this.navCtrl.push(OanotifydetailPage,{
      "notice": notice
    });
  }*/

  doRefresh(refresher) {
    setTimeout(() => {
        this.loadNotice();
        console.log('加载完成后，关闭刷新'); 
        refresher.complete();
        //toast提示
        //this.showInfo("加载成功");
    }, 2000);
  }

  //下滑动加载数据
  doInfinite(infiniteScroll){
    setTimeout(() => {
       this.loadNotice();
        console.log('加载完成后，关闭刷新'); 
        infiniteScroll.complete();
        //toast提示
        //this.showInfo("加载成功");
        //增加index
        
    }, 2000);
  }
  
  addNotify(){
    this.navCtrl.push(OanotifymodalPage);
  }
}
