import { UserInfo } from './../../module/user_vo';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

//配置文件
import { StorageProvider } from '../../providers/storage/storage';



//npm install ts-md5 --save

import {Md5} from 'ts-md5/dist/md5';

/*
  Generated class for the ToolsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToolsProvider {

  constructor(public storage:StorageProvider,public toastCtrl:ToastController) {
    console.log('Hello ToolsProvider Provider');
  }

  
  //提示
  public showToast(position: string, msg:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: position
    });

    toast.present(toast);
  }


  //获取用户信息
  public getUserInfo(){
    var userinfo = null;
    userinfo = JSON.parse(localStorage.getItem('userinfo'));

    return userinfo;
    
    
  }

  //保存用户信息
  public savaUserInfo(user) {
    this.storage.set('userinfo',JSON.stringify(user));


  }

  //清除用户
  public deleteUserInfo() {
    this.storage.remove('userinfo');
  }



  public sign(json){ 
    //
    // console.log(Md5.hashStr("123456"));
    // json={

    //   age:20,name:'zhangsan'
    // }
    var tempArr=[];
    for(let attr in json){
      tempArr.push(attr);
    }
    //排序
    tempArr=tempArr.sort();
    var tempStr='';
    for(let i=0;i<tempArr.length;i++){
      tempStr+=tempArr[i]+json[tempArr[i]];

    }
    
    return Md5.hashStr(tempStr);
   
  }

  //是否登录
  public isLogin(): boolean {
    if(this.getUserInfo() != null) {
      var user = this.getUserInfo();
      for(let k in user) {
        if(k == "username") {
          if(user[k] !== "") {
            return true;
          }
        }
      }
      
    }
    return false;

  }

  public clearAll() {
    this.deleteUserInfo();
    this.storage.clear();

  }

  
  /**格式化时间 */
  public formatDate(fmt,date = new Date()) {

    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
          
    return fmt;


  }

  public savaUserData(userInfo:UserInfo) {
    this.storage.savaUserData(userInfo);
  }

  public getUserData():Promise<UserInfo> {
    return this.storage.getUserData();
  }

  public clearUserData() {
    this.storage.clearUserData();
  }


  getFileMimeType(fileType: string): string {
    let mimeType: string = '';
  
    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }


  getFileType(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
  }

 

}
