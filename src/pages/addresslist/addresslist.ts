import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToolsProvider } from './../../providers/tools/tools';
import {ToastController  } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { HttpServicesProvider } from './../../providers/http-services/http-services';
/**
 * Generated class for the AddresslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addresslist',
  templateUrl: 'addresslist.html',
})
export class AddresslistPage {


   public addresslist =[];
    public customerVal :string;
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
                  public toolsProvider: ToolsProvider,
                  private callNumber: CallNumber,
                 ) {
                  this.customerVal = "";
                  this.loadcount(this.customerVal);

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad AddresslistPage');
  }

   //根据名字搜索
  public getItems(ev: any) {
       const customerVal = ev.target.value;
      this.loadAddressList(customerVal);
      if (customerVal && customerVal.trim() != '') {
        this.addresslist = this.addresslist.filter((addressItem) => {
        const customer = addressItem.customer;
          return (customer.toLowerCase().indexOf(customerVal.toLowerCase()) > -1);
        })
      }
    }


//call
public callPhone(tel){
  this.callNumber.callNumber(tel, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
}


//加载业务数据
  public loadcount(customerVal) {
      this.pageparam_gw = {
        "page": 1,
        "limit":10,
        "total":0
      }
      this.loadAddressList(customerVal);

  }

  //加载更多
  public loadcountMore(customerVal) {
      this.pageparam_gw.page += 1;
      this.loadAddressListMore(customerVal);

  }

//联系方式
 public loadAddressList(customerVal) {
    let url:string = "/uapi/addressList/list?customer="+customerVal;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        this.addresslist = result.page.list;
        this.pageparam_gw.total = result.page.totalPage;
      }
    })
  }

 //加载更多联系方式
  public loadAddressListMore(customerVal) {
    let url:string = "/uapi/addressList/list?customer="+customerVal;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        if(this.addresslist.length < result.page.totalPage) {
          this.addresslist.push(result.page.list);
        }else {
          this.showInfo("已经到达尾部了！");
        }
      }

    });
  }


doRefresh(refresher) {
      setTimeout(() => {
        this.loadcount(this.customerVal);
        console.log('加载完成后，关闭刷新');
        refresher.complete();

        //toast提示
        //this.showInfo("加载成功");
    }, 2000);
  }


  //下滑动加载数据
  doInfinite(infiniteScroll){

            setTimeout(() => {
                this.loadcountMore(this.customerVal)

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
