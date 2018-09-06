import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToolsProvider } from './../../providers/tools/tools';
import {ToastController  } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

 


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public doingtype :string;
  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };
  

  public dbgwlist = [];

  public pageparam_gw = {
    "page": 1,
    "limit":10,
    "total":0
  }

  public pageparam_tz = {
    "page": 1,
    "limit":10
  }

  constructor(
    public navCtrl: NavController, 
    public toastCtrl:ToastController,
    public toolsProvider: ToolsProvider,
    public loadingController: LoadingController,
    //public Events events, 
    public httpServicesProvider: HttpServicesProvider) {

      this.doingtype = "gw";
      this.toolsProvider.getUserData().then((r)=>{
        if(r != null) {
          this.userinfo.username = r.username;
          this.userinfo.userfullname = r.userfullname;
          this.loadBizness(this.doingtype);
        }else {
          //this.events.publish("logout","logout");
        }
      })
      this.loadBizness(this.doingtype);
  }


  //加载业务数据
  public loadBizness(biztype:string) {
    if(biztype == 'gw') {
      this.pageparam_gw = {
        "page": 1,
        "limit":10,
        "total":0
      }
      this.loadGW();
    }

  }

  //加载更多
  public loadBiznessMore(biztype:string) {

    if(biztype == 'gw') {
      this.pageparam_gw.page += 1;
      this.loadGWMore();
     
    }

  }

  //待办公文
  public loadGW() {
    let url:string = "/uapi/task/list?userId=" + this.userinfo.username;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        this.dbgwlist = result.page.list;
        this.pageparam_gw.total = result.page.totalPage;
      }

    })
  }


  //加载更多公文
  public loadGWMore() {
    let url:string = "/uapi/task/list?userId=" + this.userinfo.username;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        if(this.dbgwlist.length < result.page.totalPage) {
          this.dbgwlist.push(result.page.list);
        }else {
          this.showInfo("已经到达尾部了！");
        }
      }

    });
  }



  doRefreshgw(refresher) {
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



