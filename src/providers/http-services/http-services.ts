import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

import {ConfigProvider} from '../../providers/config/config';
import { ToolsProvider } from './../../providers/tools/tools';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the HttpServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpServicesProvider {

   private server : string;
   private headers = {
    
   };

 
  constructor(
    public http: HttpClient,
    public config:ConfigProvider,
    public loadingCtrl: LoadingController,
    public toolsProvider: ToolsProvider) {
    this.server = config.apiUrl;
    console.log('Hello HttpServicesProvider Provider');
   
  
  }


  //get 提交数据 https://angular-http-guide.firebaseio.com/courses.json?orderBy="$key"&limitToFirst=1
  public doGet(apiUrl,callback){
    var url = this.server + apiUrl;
    var cdate = new Date().getTime();
    if(url.indexOf("?") > -1) {
      url += "&flag=" + cdate;
    }else {
      url += "?flag=" + cdate;
    }
    let loader = this.loadingCtrl.create({
      content: "请等待，正在处理..."
    });
    this.http.get(url,{headers:this.headers}).subscribe((response) => {
      loader.dismiss();
      callback(response);
    },(error)=>{
        loader.dismiss();
        this.toolsProvider.showToast("top","网络请求错误");
    });
    

  }

  public doGetParams(apiUrl,data,callback){
    var url = this.server + apiUrl;
    var cdate = new Date().getTime();
    if(url.indexOf("?") > -1) {
      url += "&flag=" + cdate;
    }else {
      url += "?flag=" + cdate;
    }
    let loader = this.loadingCtrl.create({
      content: "请等待，正在处理..."
    });
    this.http.get(url, {headers:this.headers,params:data}).subscribe((response) => {
      loader.dismiss();
      callback(response);
    },(error)=>{
      loader.dismiss();
      this.toolsProvider.showToast("top","网络请求错误");
    });
    

  }


   //post 提交数据
   public doPost(apiUrl,data,callback){
     //alert(1);
    var url = this.server + apiUrl;
    var cdate = new Date().getTime();
    if(url.indexOf("?") > -1) {
      url += "&flag=" + cdate;
    }else {
      url += "?flag=" + cdate;
    }
    let loader = this.loadingCtrl.create({
      content: "请等待，正在处理..."
    });
    loader.present();
    this.http.post(url, data).subscribe((response) => {
      loader.dismiss();
      callback(response);
    },(error)=>{
        loader.dismiss();
        console.log("do post url=" + url + ",err="+error);
        alert(JSON.stringify(error));
        this.toolsProvider.showToast("top","网络请求错误");
    });
    
  }


  //post 签到
  public doQRPost(apiUrl,data,callback){
    //alert(1);
   var url = apiUrl;
   var cdate = new Date().getTime();
   if(url.indexOf("?") > -1) {
     url += "&flag=" + cdate;
   }else {
     url += "?flag=" + cdate;
   }
   let loader = this.loadingCtrl.create({
     content: "请等待，签到验证中..."
   });
   loader.present();
   this.http.post(url, data).subscribe((response) => {
     loader.dismiss();
     callback(response);
   },(error)=>{
       loader.dismiss();
       console.log("do post url=" + url + ",err="+error);
       alert(JSON.stringify(error));
       this.toolsProvider.showToast("top","网络请求错误");
   });
   
 }

  

}
