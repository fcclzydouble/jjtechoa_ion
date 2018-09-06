import { OacalenderPage } from './../oacalender/oacalender';
import { MeetingjoinPage } from './../meetingjoin/meetingjoin';
import { ChatmainPage } from './../chatmain/chatmain';
import { AddresslistPage } from './../addresslist/addresslist';
import { AppFunction } from './../../module/oa_function';
import { LoginPage } from './../login/login';
import { ToolsProvider } from './../../providers/tools/tools';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { OadoingPage } from './../oadoing/oadoing';
import { Device } from '@ionic-native/device';

import { JPush } from '@jiguang-ionic/jpush';
import { OanotifyPage } from '../oanotify/oanotify';






/**
 * Generated class for the OaworkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oawork',
  templateUrl: 'oawork.html',
})
export class OaworkPage {
  public focusList : Array<String> = [
    "assets/imgs/jjtechoa1.gif",
    "assets/imgs/jjtechoa2.gif"
  ];

  public appfuns1 :Array<AppFunction> = [
    new AppFunction("tbgw","待办事项","assets/imgs/tbgw.png"),
    new AppFunction("xxtz","消息通知","assets/imgs/xxtz.png"),
    new AppFunction("hytz","在线投票", "assets/imgs/hytz.png")
  ];

  public appfuns2 :Array<AppFunction> = [
    new AppFunction("lxfs","联系方式","assets/imgs/lxfs.png"),
    new AppFunction("hyjd","会议签到","assets/imgs/hyjd.png"),
    new AppFunction("zxqq","在线聊天","assets/imgs/zxqq.png")
  ];

  public appfuns3 :Array<AppFunction> = [
      new AppFunction("zxkf","在线客服","assets/imgs/zxkf.png"),
      new AppFunction("calender","我的日程","assets/imgs/calendar-icon.png")
  ];

  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };



  public oadoingNums:number;//待办数
  public infonoteNums:number;//消息通知数
  public onlinechatNums:number;//在线聊天数
  public onlineserveNums:number;//在线客服数

  public registrationId: string;
  protected devicePlatform: string;
  protected sequence: number = 0;

  public tagResultHandler = function(result) {
    var sequence: number = result.sequence;
    var tags: Array<string> = result.tags == null ? [] : result.tags;
    console.log('Success!' + '\nSequence: ' + sequence + '\nTags: ' + tags.toString());

  };

  public aliasResultHandler = function(result) {
    var sequence: number = result.sequence;
    var alias: string = result.alias;
    console.log('Success!' + '\nSequence: ' + sequence + '\nAlias: ' + alias);

  };

  public errorHandler = function(err) {
    var sequence: number = err.sequence;
    var code = err.code;
    console.log('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code);
  };





  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public jpush: JPush,
    public device: Device,
    public toolsProvider: ToolsProvider,
    public events:Events) {
      this.toolsProvider.getUserData().then((r)=>{
        if(r != null) {
          this.userinfo.username = r.username;
          this.userinfo.userfullname = r.userfullname;
          console.log('OaworkPage username=' + r.username);
        }else {
          console.log('OaworkPage not login');
          this.events.publish("logout","logout");
        }

      })

      this.devicePlatform = device.platform;
      this.oadoingNums = 0;
      this.infonoteNums = 0;
      this.onlinechatNums = 0;
      this.onlineserveNums = 0;
      this.notifyParent();
      events.subscribe("oa",(r)=>{
        if(r == "task") {
          this.oadoingNums -=1;
        }else if(r == "notice") {
          this.infonoteNums -= 1;
        }
        this.notifyParent();
      })

      document.addEventListener('jpush.openNotification', (event: any) => {
        alert('jpush.openNotification' + JSON.stringify(event));
        this.jpush.setBadge(0);
        this.jpush.setApplicationIconBadgeNumber(0);
      })

      document.addEventListener('jpush.receiveNotification', (event: any) => {
        var content;
        var extras;
        try{

          if (this.devicePlatform == 'Android') {
            content = event.alert;
            extras = event.extras

          } else {
            content = event.aps.alert;
            extras = event.aps.extras;
          }
          console.log(extras);
          let users:string = extras.users;
          if(this.isCurrentUser(users)) {
            let msgType:string = extras.msgType;
            if(msgType == "task") {
              this.oadoingNums += 1;
              this.notifyParent();
            }else if(msgType == "notice") {
              this.infonoteNums += 1;
              this.notifyParent();
            }

           this.jpush.setBadge(0);
           let total_num = this.oadoingNums + this.infonoteNums +  this.onlinechatNums + this.onlineserveNums;
           this.jpush.setApplicationIconBadgeNumber(0);

          }


        }catch(e) {
          console.log(e);
        }


      }, false);



      document.addEventListener('jpush.openNotification', (event: any) => {
        var content;
        if (this.devicePlatform == 'Android') {
          content = event.alert;
        } else {  // iOS
          if (event.aps == undefined) { // 本地通知
            content = event.content;
          } else {  // APNS
            content = event.aps.alert;
          }
        }
        //alert('open notification: ' + JSON.stringify(event));
        this.toolsProvider.showToast("top",'open notification: ' + JSON.stringify(event))
      }, false);


      document.addEventListener('jpush.receiveLocalNotification', (event: any) => {
        // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发。
        var content;
        if (this.devicePlatform == 'Android') {

        } else {
          content = event.content;
        }
        //alert('receive local notification: ' + JSON.stringify(event));
        //this.toolsProvider.showToast("top",'receive local notification: ' + JSON.stringify(event))
      }, false);




  }

  public notifyParent() {
    let total_num = this.oadoingNums + this.infonoteNums +  this.onlinechatNums + this.onlineserveNums;
    this.events.publish("infonums:tab",total_num);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OaworkPage');
    this.toolsProvider.getUserData().then((r)=>{
      if(r != null) {
        this.userinfo.username = r.username;
        this.userinfo.userfullname = r.userfullname;
        console.log('OaworkPage username=' + r.username);
        this.setAlias();
      }else {
        console.log('OaworkPage not login');
        this.events.publish("logout","logout");
      }

    })
  }



  public oadoing() {
    this.navCtrl.push(OadoingPage);
  }

  public isCurrentUser(users:string):boolean {
    let result:boolean = false;
    if(users != '' ) {
      let ua:Array<string> = users.split(",");
      for(let i = 0; i < ua.length;i++) {
        if(ua[i] == this.userinfo.username) return true;
      }
    }
    return result;
  }


  //------极光推送 接口调用---------------
  getRegistrationID() {
    this.jpush.getRegistrationID()
      .then(rId => {
        this.registrationId = rId;
      });
  }

  setTags() {

    this.jpush.setTags({ sequence: this.sequence++, tags: ['Tag1', 'Tag2']})
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  addTags() {
    this.jpush.addTags({ sequence: this.sequence++, tags: ['Tag3', 'Tag4']})
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  checkTagBindState() {
    this.jpush.checkTagBindState({ sequence: this.sequence++, tag: 'Tag1' })
      .then(result => {
        var sequence = result.sequence;
        var tag = result.tag;
        var isBind = result.isBind;
        alert('Sequence: ' + sequence + '\nTag: ' + tag + '\nIsBind: ' + isBind);
      }).catch(this.errorHandler);
  }

  deleteTags() {
    this.jpush.deleteTags({ sequence: this.sequence++, tags: ['Tag4']})
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  getAllTags() {
    this.jpush.getAllTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  cleanTags() {
    this.jpush.cleanTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  setAlias() {
    var alias = this.userinfo.username;
    this.jpush.setAlias({ sequence: this.sequence++, alias: alias})
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  getAlias() {
    this.jpush.getAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  deleteAlias() {
    this.jpush.deleteAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  addLocalNotification() {
    if (this.devicePlatform == 'Android') {
      this.jpush.addLocalNotification(0, 'Hello JPush', 'JPush', 1, 5000);
    } else {
      this.jpush.addLocalNotificationForIOS(5, 'Hello JPush', 1, 'localNoti1');
    }
  }

  public goModule(tmodule:AppFunction) {
    switch(tmodule.id) {
      case "tbgw":
        this.navCtrl.push(OadoingPage);
        break;
      case "zxqq":
        this.navCtrl.push(ChatmainPage);
        break;
      case "hyjd":
        this.navCtrl.push(MeetingjoinPage);
        break;
      case "lxfs":
        this.navCtrl.push(AddresslistPage);
        break;
      case "xxtz":
        this.navCtrl.push(OanotifyPage);
        break;
      case "calender":
        this.navCtrl.push(OacalenderPage);
        break;        
      default :
        console.log("no component");


    }

  }



}


