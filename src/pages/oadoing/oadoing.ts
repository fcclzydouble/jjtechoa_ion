import { LoginPage } from './../login/login';
import { OaexcutingPage } from './../oaexcuting/oaexcuting';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToolsProvider } from './../../providers/tools/tools';
import {ToastController  } from 'ionic-angular';

import { HttpServicesProvider } from './../../providers/http-services/http-services';



/**
 * Generated class for the OadoingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oadoing',
  templateUrl: 'oadoing.html',
})
export class OadoingPage {

  public pushPage: any;
  public doingtype :string;
  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };


  public dbsylist = [];

  public pageparam_gw = {
    "page": 1,
    "limit":10,
    "total":0
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpServicesProvider: HttpServicesProvider,
    public toastCtrl: ToastController,
    public events: Events,
    public toolsProvider: ToolsProvider) {

      this.doingtype = "db_sy";
      this.pushPage = OaexcutingPage;
      this.toolsProvider.getUserData().then((r)=>{
        if(r != null) {
          this.userinfo.username = r.username;
          this.userinfo.userfullname = r.userfullname;
          this.loadBizness(this.doingtype);
        }else {
          this.events.publish("logout","logout");
        }
      })


      events.subscribe("subpage:pop",(r)=>{
        this.loadBizness(this.doingtype);
        events.publish("oawork","task");
      })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OadoingPage');
  }

  public oaexcuteing(syitem) {
    this.navCtrl.push(OaexcutingPage,
      {"taskInstId":syitem.taskId,"instId":syitem.processInstId,"userId":this.userinfo.username,"nodeName": syitem.nodeName}
    );
  }


  //加载业务数据
  public loadBizness(biztype:string) {
    if(biztype == 'db_sy') {
      this.pageparam_gw = {
        "page": 1,
        "limit":10,
        "total":0
      }
      this.loadSY();
    }

  }

  //加载更多
  public loadBiznessMore(biztype:string) {

    if(biztype == 'db_sy') {
      this.pageparam_gw.page += 1;
      this.loadSYMore();

    }

  }

  //待办公文
  public loadSY() {
    let url:string = "/uapi/task/list?userId=" + this.userinfo.username;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        this.dbsylist = result.page.list;
        this.pageparam_gw.total = result.page.totalPage;
      }

    })
  }


  //加载更多公文
  public loadSYMore() {
    let url:string = "/uapi/task/list?userId=" + this.userinfo.username;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        if(this.dbsylist.length < result.page.totalPage) {
          this.dbsylist.push(result.page.list);
        }else {
          this.showInfo("已经到达尾部了！");
        }
      }

    });
  }



  doRefresh(refresher) {
      setTimeout(() => {
        this.loadBizness(this.doingtype);
        console.log('加载完成后，关闭刷新');
        refresher.complete();

        //toast提示
        //this.showInfo("加载成功");
    }, 2000);
  }

  //下滑动加载数据
  doInfinite(infiniteScroll){

            setTimeout(() => {
                this.loadBiznessMore(this.doingtype)

                console.log('加载完成后，关闭刷新');
                infiniteScroll.complete();

                //toast提示
                //this.showInfo("加载成功");
                //增加index




            }, 2000);
        }


  //提示信息
  showInfo(msg){
    let toast = this.toastCtrl.create({
        message: msg, //提示消息
        duration: 3000,//3秒后自动消失
        position: 'bottom',//位置top,bottom
        showCloseButton:true, //是否显示关闭按钮
        closeButtonText:"关闭" //关闭按钮字段
    });

    //关闭后执行的操作
    toast.onDidDismiss(() => { console.log('toast被关闭之后执行'); });

    //显示toast
    toast.present();//符合触发条件后立即执行显示。
}

}
