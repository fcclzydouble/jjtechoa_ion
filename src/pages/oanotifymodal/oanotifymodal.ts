import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ToolsProvider } from '../../providers/tools/tools';

/**
 * Generated class for the OanotifymodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oanotifymodal',
  templateUrl: 'oanotifymodal.html',
})
export class OanotifymodalPage {

  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };
  
  public listReceived;
  public listType;
  public listMeet;
  public meetTime;
  public meetAddress;


  public receivedByName;
  

  public notify = {
    nTitle: '',
    nType: '0',
    meetId: '',
    list: [],
    nContent: ''
  };

  isDisplay = true;
  isDisabled = false;

  constructor(public navCtrl: NavController, 
              public httpServicesProvider: HttpServicesProvider,
              public navParams: NavParams,
              public events: Events,
              public toolsProvider: ToolsProvider) {
    //
    this.toolsProvider.getUserData().then((r)=>{
      if(r != null) {
        this.userinfo.username = r.username;
        this.userinfo.userfullname = r.userfullname;
        this.loadNoticeType();
        this.loadReceived();
      }else {
        this.events.publish("logout","logout");
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OanotifymodalPage');
  }

  loadNoticeType(){
    let url:string = "/uapi/sys/dict/select/notice";
    this.httpServicesProvider.doGetParams(url, null, (result)=>{
      if(0 == result.code) {
        this.listType = result.list;
      }
    });
  }

  loadMeet(){
    let url:string = "/uapi/oa/meet/list"
    this.httpServicesProvider.doGetParams(url, null, (result)=>{
      if(0 == result.code) {
        this.listMeet = result.page.list;
      }
    });
  }

  loadMeetInfo(meetId){
    console.log("loadMeetInfo------meetId:" + meetId);
    let url:string = "/uapi/oa/meet/info/" + meetId;
    this.httpServicesProvider.doGetParams(url, null, (result)=>{
      if(0 == result.code) {
        var meet = result.actMeetEntity;
        this.meetTime = meet.meetStartDate + ' - ' + meet.meetEndDate;
        this.meetAddress = meet.meetAddress;
        this.receivedByName = meet.meetJoinUserId.split(",")
      }
    });
  }

  loadReceived(){
    let url:string = "/uapi/sys/user/listAll"
    this.httpServicesProvider.doGetParams(url, null, (result)=>{
      if(0 == result.code) {
        console.log("loadReceived:" + result);
        this.listReceived = result.page.list;
      }
    });
  }

  selectType(typeCode){
    console.log("selectType------typeCode:" + typeCode);
    if('1' == typeCode){
      this.isDisplay = false;
      this.isDisabled = true;
      this.loadMeet();
    }else{
      this.isDisplay = true;
      this.isDisabled = false;
    }
  }

  selectMeet(meetId){
    console.log("selectMeet------meetId:" + meetId);
    this.loadMeetInfo(meetId);
  }

  isSelected(selectValue) : boolean{
    let bl = false;
    if('' != selectValue && null != this.receivedByName){
      for(let i in this.receivedByName){
        if(selectValue == this.receivedByName[i]){
          bl = true;
        }
      }
    }
    return bl;
  }

  save(){
    if('' == this.notify.nTitle ){
      this.toolsProvider.showToast("top", "标题不能为空");
    }else{
      let url:string = "/uapi/oa/notice/save"
      if(null != this.receivedByName){
        var relNotify = [];
        for(var i = 0; i < this.receivedByName.length; i++){
          relNotify.push({
            "sUserName": this.receivedByName[i]
          });
        }
        this.notify.list = relNotify;
      }
      console.log("save --- list: " + this.notify.list);
      
      this.notify["sUserName"] = this.userinfo.username;
      this.httpServicesProvider.doPost(url, this.notify, (result)=>{
        if(0 == result.code){
          this.toolsProvider.showToast("top", "保存成功");
          this.navCtrl.pop();
        }
      });
    }
  }

}
