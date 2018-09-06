import { NewsShowPage } from './../newsshow/newsshow';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToolsProvider } from './../../providers/tools/tools';
import {ToastController  } from 'ionic-angular';

import { HttpServicesProvider } from './../../providers/http-services/http-services';
import {ConfigProvider} from '../../providers/config/config';


/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  public pushPage: any;
  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };

  public news = {
    title : '',
    categoryId : ''
  } 

  public sub_width = 62;
  
  public categorys = [];

  public newslist = [];

  public pageparam_gw = {
    "page": 1,
    "limit":10,
    "total":0
  }
  widths = {};
  segmentIndex = 0;
  segmentsArray: Array<string> = new Array<string>();
  segmentModel = this.segmentsArray[0];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public httpServicesProvider: HttpServicesProvider,
    public toastCtrl: ToastController,
    public events: Events,
    public config:ConfigProvider,
    public toolsProvider: ToolsProvider) {
     
      this.pushPage = NewsShowPage;
      this.toolsProvider.getUserData().then((r)=>{
        if(r != null) {
          this.userinfo.username = r.username;
          this.userinfo.userfullname = r.userfullname;
        }else {
          this.events.publish("logout","logout");
        }
      })


      

      this.news.title = '';
      this.news.categoryId = '';

      this.loadCategorys();

      events.subscribe("subpage:pop",(r)=>{
        this.loadBizness(this.news.categoryId);
      })
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

  
  public loadCategorys() {
    let url:string = "/uapi/cms/getshowcategory?username=" + this.userinfo.username;
    this.httpServicesProvider.doGetParams(url, [], (result)=>{
      if(result.code == '0') {
        this.categorys = result.categorys;
        for(var i = 0; i < result.categorys.length; i++) {
          this.segmentsArray[i] = result.categorys[i].id;
        }
        this.segmentModel = this.segmentsArray[0];
        this.queryNews(this.categorys[0].id, '-1');
        this.widths = { "width": this.segmentsArray.length * 70 + "px" };
      }
    })
  }
  //加载业务数据
  public loadBizness(categoryId:string) {
    if(categoryId == '') {
      this.pageparam_gw = {
        "page": 1,
        "limit":10,
        "total":0
      }
      this.loadSY();
    }

  }

  //加载更多
  public loadBiznessMore(categoryId:string) {

    if(categoryId != '-1') {
      this.pageparam_gw.page += 1;
      this.loadSYMore();
    }

  }

  //
  public loadSY() {
    let url:string = "/uapi/news/list?categoryId=" + this.news.categoryId + "&title=" + this.news.title;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        this.newslist = result.page.list;
        if(this.newslist != null && this.newslist.length > 0) {
            for(var i = 0; i < this.newslist.length; i++) {
                if(this.newslist[i].image == null || this.newslist[i].image == '') {
                    this.newslist[i].image = '';
                } else {
                    var imgname = this.newslist[i].image;
                    imgname = imgname.substring(imgname.indexOf('?'));
                    this.newslist[i].image = this.config.apiUrl + '/uapi/news/showimg' + imgname;
                }
            }
        }
        this.pageparam_gw.total = result.page.totalPage;
      }

    })
  }

  public queryNews(categoryId, indx) {
    this.news.categoryId = categoryId;
    this.newslist = [];
    this.pageparam_gw = {
      "page": 1,
      "limit":10,
      "total":0
    }
    var sobj = document.getElementById('sub_header_list');
    var menuobj = document.getElementById('subbtn_' + categoryId);
    if(menuobj != null) {
      var toscroll = menuobj.offsetLeft - 100;
      if(toscroll > 0) {
        sobj.scrollLeft = toscroll;
      } else if(toscroll < -10) {
        sobj.scrollLeft = 0;
      }
    }
    if(indx != '-1') {
      let showIndx = Math.floor(screen.width / 70);
      if ((indx+1) >=(showIndx-1)){
        (document.getElementById('test').scrollLeft += 70);
      }
      if ((indx+1) <showIndx) {
        (document.getElementById('test').scrollLeft -= 70);
      }
      this.segmentModel = this.segmentsArray[indx];
    }
    this.loadSY();
  }

  public showNewDetail(newsid) {
    this.navCtrl.push(NewsShowPage, {'newsid' : newsid});
  }

  //
  public loadSYMore() {
    let url:string = "/uapi/news/list?categoryId=" + this.news.categoryId + "&title=" + this.news.title;
    this.httpServicesProvider.doGetParams(url,this.pageparam_gw,(result)=>{
      if(result.code == "0") {
        if(this.newslist.length < result.page.totalPage) {
          this.newslist.push(result.page.list);
        }else {
          this.showInfo("已经到达尾部了！");
        }
      }

    });
  }



  doRefresh(refresher) {
      setTimeout(() => {
        this.loadBizness(this.news.categoryId);
        console.log('加载完成后，关闭刷新'); 
        refresher.complete();
        
        //toast提示
        //this.showInfo("加载成功");
    }, 2000);
  }

  //下滑动加载数据
  doInfinite(infiniteScroll){
    
            setTimeout(() => {
                this.loadBiznessMore(this.news.categoryId)
               
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

  
  swipeNews(event) {
    
    if (event.direction == 4) {
      if(this.segmentIndex != 0) {
        this.segmentIndex = this.segmentIndex - 1;
        this.queryNews(this.segmentsArray[this.segmentIndex], '-1');
      } 
    } else if(event.direction == 2) {
      if(this.segmentIndex < (this.segmentsArray.length - 1)) {
        this.segmentIndex = this.segmentIndex + 1;
        this.queryNews(this.segmentsArray[this.segmentIndex], '-1');
      }
    }
    this.segmentModel = this.segmentsArray[this.segmentIndex]; 
  }

}
