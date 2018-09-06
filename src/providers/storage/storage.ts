import { UserInfo } from './../../module/user_vo';
import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';



/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(public storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  public set(key,value){
    
    localStorage.setItem(key,value);  /*对象转换成字符串*/
    //this.storage.set(key,JSON.stringify(value));
  }

  public get(key){
    return localStorage.getItem(key);  /*字符串转换成对象*/
    // return this.storage.get(key).then((val) => {
    //   return val;
    // })
  }

  public remove(key){

    localStorage.removeItem(key);
    //this.remove(key);
  }

  public clear() {
    localStorage.clear();
    //this.storage.clear();
  }
  

  public getUserData():Promise<UserInfo> {
    return this.storage.get("UserInfo").then((r)=>{
      if(r == null) return null;
      return JSON.parse(r);
    });

  }

  public savaUserData(userInfo:UserInfo) {

    this.storage.set("UserInfo",JSON.stringify(userInfo));
  }

  public clearUserData() {
    this.storage.clear();
  }



}
