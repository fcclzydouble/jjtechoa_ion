import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { ToolsProvider } from './../../providers/tools/tools';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';



/**
 * Generated class for the MeetingjoinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meetingjoin',
  templateUrl: 'meetingjoin.html',
})
export class MeetingjoinPage {
  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toolsProvider :ToolsProvider,
    public events :Events,
    public qrScanner: QRScanner,
    public alertController : AlertController,
    public httpServicesProvider :HttpServicesProvider) {

      this.light = false;
      this.frontCamera = false;

      this.toolsProvider.getUserData().then((r)=>{
        if(r != null) {
          this.userinfo.username = r.username;
          this.userinfo.userfullname = r.userfullname;
          
        }else {
          this.events.publish("logout","logout");
        }
      });




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingjoinPage');
  }

  ionViewWillEnter() {
 
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
       
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          
          
          let url = text + "&userId=" + this.userinfo.username;
          //alert(url);
          this.httpServicesProvider.doQRPost(url,{flag:"sj"},(r)=>{
            let code = r.code;
            let msg = r.msg;
            this.showInfo(msg);

          });
          
          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
          
        });

        // show camera preview
        this.qrScanner.show();


        // wait for user to scan something, then the observable callback will be called
      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
    }).catch((e: any) => console.log('Error is', e));
  }

  ionViewDidEnter() {
    //页面可见时才执行
    this.showCamera();
    this.isShow = true;//显示背景
  }

   /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }


  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }


  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }
  
  hideCamera() {
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  ionViewWillLeave() {
    this.hideCamera();
  }


   //提示信息
   showInfo(msg){
      const alert = this.alertController.create({
        title: '签到结果',
        subTitle: msg,
        buttons: [{text:'确定',handler:()=>{
          this.navCtrl.pop();
        }
      }]
      });
      alert.present();
  }

}
