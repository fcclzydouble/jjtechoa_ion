import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import * as moment from 'moment';
import { ToolsProvider } from '../../providers/tools/tools';
import { HttpServicesProvider } from '../../providers/http-services/http-services';

/**
 * Generated class for the OacalendareventmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oacalendareventmodal',
  templateUrl: 'oacalendareventmodal.html',
})
export class OacalendareventmodalPage {

  public userinfo = {
      username: '',
      password: '',
      userfullname: ''
  };
  public pageparam = {}

  listType;
  listRemindType;
  remindTypeCheckBox;

  isFlag;
  public schedule = {
    sTitle: '',
    sType: '0',
    sBenTime: '', 
    sEndTime: '', 
    sContent: '',
    remindType: '',
    remindTime: '',
    remindTimeU:'dd',
    createUser: ''
  };
 // minDate = new Date().toISOString();
 

  callback;

  constructor(
    public navCtrl: NavController, 
    private navParams: NavParams, 
    public viewCtrl: ViewController,
    public httpServicesProvider: HttpServicesProvider,
    public events: Events,
    public toolsProvider: ToolsProvider) {

    this.callback = this.navParams.get("callback");

    this.isFlag = this.navParams.get("isFlag");
    let temp = this.navParams.get("schedule");
   
    if(temp){
      this.schedule = temp;
    }
    this.schedule.sBenTime = moment(this.schedule.sBenTime).format();
    this.schedule.sEndTime = moment(this.schedule.sEndTime).format();
    // let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    // this.schedule.sBenTime = preselectedDate;
    // this.schedule.sEndTime = preselectedDate;

  //加载用户
  this.toolsProvider.getUserData().then((r)=>{
      if(r != null) {
        this.userinfo.username = r.username;
        this.userinfo.userfullname = r.userfullname;
        this.loadListType();
        this.loadListRemindType();
      }else {
        this.events.publish("logout","logout");
      }
    });
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }
 
  // <button [ngStyle]="{'display': isFlag === false ? 'none' : 'block' }" ion-button full icon-left (click)="save()">
  //   <ion-icon name="checkmark"></ion-icon> 新增日程
  // </button>
  save() {
    let url = "/uapi/oa/schedule/saveOrUpdate";   

    // console.log(moment(this.schedule.sBenTime).diff(moment(this.schedule.sEndTime)));
    if('' == this.schedule.sTitle){
      this.toolsProvider.showToast("top", "日程标题不能为空");
    }else if('' == this.schedule.sType){
      this.toolsProvider.showToast("top", "日程类型不能空");
    }else if(moment(this.schedule.sBenTime).diff(moment(this.schedule.sEndTime)) > 0){
      this.toolsProvider.showToast("top", "开始时间不大于结束时间");
    }else{
      this.schedule.sBenTime = moment(this.schedule.sBenTime).format("YYYY-MM-DD HH:mm:ss");
      this.schedule.sEndTime = moment(this.schedule.sEndTime).format("YYYY-MM-DD HH:mm:ss");
      this.schedule.createUser = this.userinfo.username;
      console.log("remindType:" + this.schedule);
      this.httpServicesProvider.doPost(url, this.schedule, (result)=>{
        if(0 == result.code){
          // this.viewCtrl.dismiss(event);  
          //this.viewCtrl.dismiss();
          let param = '我是来自OacalendareventmodalPage的值'
          this.callback(param).then(()=>{
            this.navCtrl.pop();
          });
        }else{
          this.toolsProvider.showToast("top", result.msg);
        }
      });
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OacalendareventmodalPage');
  }

  //类型
  loadListType(){
    let url:string = "/uapi/sys/dict/select/schedule";
    this.httpServicesProvider.doGetParams(url, null, (result)=>{
      if(0 == result.code) {
        this.listType = result.list;
      }
    });
  }

  //提醒方式
  loadListRemindType(){
    let url:string = "/uapi/sys/dict/select/remind";
    this.httpServicesProvider.doGetParams(url, null, (result)=>{
      if(0 == result.code) {
        this.listRemindType = result.list;
      }
    });
  }

  //(ionChange)="onChange(remType.code, $event.checked)" 
  // onChange(id, isChecked, index) {
  //   console.log("onChange:" + isChecked);
    
  // }

  selectedArray :any = [];

  onChange(data, isChecked){
    if (isChecked) {
       this.selectedArray.push(data.code);
     } else {
      let newArray = this.selectedArray.filter(function(el) {
        return el.code !== data.code;
     });
      this.selectedArray = newArray;
    }
    this.schedule.remindType = this.selectedArray.join(",");
    console.log(this.selectedArray);
   }

  isChecked(codeValue):Boolean {
    let bl = false;
    if(this.schedule.remindType){
      if(this.schedule.remindType.indexOf(codeValue) != -1){
        bl = true;
      }
    }
    return bl;
  } 
}
