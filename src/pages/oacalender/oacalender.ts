import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, Platform, ViewController, AlertController } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ToolsProvider } from '../../providers/tools/tools';
import * as moment from 'moment';

import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);



/**
 * Generated class for the OacalenderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oacalender',
  templateUrl: 'oacalender.html',
})
export class OacalenderPage {

    eventSource;
    viewTitle;

    selectedDay = new Date();
    
  
    isToday:boolean;

    calendar = {
      mode: 'month',
      locale: 'zh-CN',
      noEventsLabel: '无',
      formatHourColumn: 'HH:mm',
      formatDayTitle: 'yyyy年MM月dd日',
      formatWeekTitle: 'yyyy年MM月 第w周',
      formatMonthTitle: 'yyyy年MM月',
      formatDayHeader: 'EEE d',
      allDayLabel: '全天',
      currentDate: new Date(),
    };


    public userinfo = {
        username: '',
        password: '',
        userfullname: ''
    };

    public listCalender = [];

    public pageparam = {}

    constructor(public navCtrl: NavController, 
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public httpServicesProvider: HttpServicesProvider,
        public events: Events,
        public toolsProvider: ToolsProvider,
        private alertCtrl: AlertController) {

          //加载用户
          this.toolsProvider.getUserData().then((r)=>{
            if(r != null) {
              this.userinfo.username = r.username;
              this.userinfo.userfullname = r.userfullname;
              this.load2Calender();
            }else {
              this.events.publish("logout","logout");
            }
          });

    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad OacalenderPage');
    }
  
    loadEvents() {
      this.eventSource = this.createRandomEvents();
    }
  
    onViewTitleChanged(title) {
      this.viewTitle = title;
    }
  
    //
    onEventSelected(event) {
      //console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
      // let start = moment(event.startTime).format('YYYY-MM-DD HH:mm:ss');
      // let end = moment(event.endTime).format('YYYY-MM-DD HH:mm:ss');
      
      // let alert = this.alertCtrl.create({
      //   title: '' + event.title,
      //   subTitle: '日程类型：' + event.sType + '<br>开始时间: ' + start + '<br>结束时间: ' + end,
      //   buttons: ['确定']
      // });
      // alert.present();
      let calendarObj = {
        sTitle: event.title,
        sBenTime: event.startTime,
        sEndTime: event.endTime,
        sType: event.sType,
        remindTime: event.remindTime,
        remindTimeU: event.remindTimeU,
        remindType: event.remindType,
        sContent: event.sContent
      }

      // let modal = this.modalCtrl.create('OacalendareventmodalPage', {schedule: calendarObj, isFlag: false});
      // modal.present();

      this.navCtrl.push('OacalendareventmodalPage', {
        schedule: calendarObj, 
        isFlag: false,
        callback: this.myCallbackFunction
      });
    }
  
    changeMode(mode) {
      this.calendar.mode = mode;
    }
  
    today() {
      this.calendar.currentDate = new Date();
    }
  
    onTimeSelected(ev) {
      //console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
      //  (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);

       // let modal = this.modalCtrl.create(CalendarModalContentPage, {"selectedTime": ev.selectedTime});
       // modal.present();
       this.selectedDay = ev.selectedTime;
    }
  
    onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
    }
  
    createRandomEvents() {
      var events = [];
      var list = this.listCalender
      if(null != list){
        for (var i = 0; i < list.length; i += 1) {
            var startTime;
            var endTime;
            
            if(null != list[i].sBenTime){
                startTime = new Date(list[i].sBenTime);
            }
            if(null != list[i].sEndTime){
                endTime = new Date(list[i].sEndTime);
            }

            events.push({
                title:  list[i].sTitle,
                startTime: startTime,
                endTime: endTime,
                sType: list[i].sType,
                remindTime: list[i].remindTime,
                remindTimeU: list[i].remindTimeU,
                remindType: list[i].remindType,
                sContent: list[i].sContent,
                allDay: false
            });
        }
      }
      return events;
    }
  
    onRangeChanged(ev) {
      console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }
  
    markDisabled = (date:Date) => {
      var current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
    };


    load2Calender(){
        let url:string = "/uapi/oa/schedule/list";
        this.pageparam = {
            "userName": this.userinfo.username
        }
        this.httpServicesProvider.doGetParams(url, this.pageparam, (result)=>{
            if(0 == result.code) {
              this.listCalender = result.list;
              this.loadEvents();
            }
        })
    }

    //新增
    addEvent(){

      let calendarObj = {
        sTitle: '',
        sBenTime: this.selectedDay,
        sEndTime: this.selectedDay,
        sType: '0',
        remindTime: '',
        remindTimeU: 'dd',
        remindType: '',
        sContent: ''
      }

      this.navCtrl.push('OacalendareventmodalPage', {
        schedule: calendarObj, 
        isFlag: true,
        callback: this.myCallbackFunction
      });

      // let modal = this.modalCtrl.create('OacalendareventmodalPage',  {schedule: calendarObj, isFlag: true});
      // modal.onDidDismiss(data => {
      //   this.load2Calender();
      // }); 
      // modal.present();
    }

    myCallbackFunction  = (params) => {
      return new Promise((resolve, reject) => {
       if(typeof(params)!='undefined'){
           resolve('ok');
           console.log('myCallbackFunction回调: '+ params);
           if(params){
             this.load2Calender();
           }
       }else{
           reject(Error('error'))
       }
             
    });
  }
}
