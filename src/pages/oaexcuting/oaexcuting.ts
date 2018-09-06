import { ConfigProvider } from './../../providers/config/config';
import { AppAvailability } from '@ionic-native/app-availability';
import { BizDocumentAttach } from './../../module/oa_bizDocumentAttach';
import { ToolsProvider } from './../../providers/tools/tools';
import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {ToastController  } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';







declare let startApp:any;

/**
 * Generated class for the OaexcutingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oaexcuting',
  templateUrl: 'oaexcuting.html',
})
export class OaexcutingPage {
  public  formextValueRepresentationMobile= {
    "processDefId": '',
    "processInstId": '',
    "processInstName": '',
    "fromTaskId": '',
    "fromTaskNodeId": '',
    "fromTaskNodeName": '',
    "bizDocId": '',
    "bizDocTitile": '',
    "toTaskNodeId": '',
    "toTaskNodeName": '',
    "participants": '',
    "actionCode": '',
    "curTaskFormKey": '',
    "bizData": {},
    "spData": {}
  };
  public formextValueRepresentation = {
    "processDefId": '',
    "processInstId": '',
    "processInstName": '',
    "fromTaskId": '',
    "fromTaskNodeId": '',
    "fromTaskNodeName": '',
    "bizDocId": '',
    "bizDocTitile": '',
    "toTaskNodeId": '',
    "toTaskNodeName": '',
    "participants": '',
    "actionCode": '',
    "curTaskFormKey": '',
    "bizData": {},
    "spData": {}
  };

  public userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };

  public bizattachzw:BizDocumentAttach = new BizDocumentAttach();

  public bizData :any = {}
  public spData :any = {};
  public nodeName = "";



  


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toolsProvider: ToolsProvider,
    public configProvider: ConfigProvider,
    public toastCtrl: ToastController,
    public events: Events,
    public alertCtl: AlertController,
    public platform: Platform,
    public fileTransfer:FileTransfer,
    public file :File,
    public fileOpener: FileOpener,
    public appAvailability: AppAvailability,
    public httpServicesProvider: HttpServicesProvider) {
    this.nodeName = this.navParams.get("nodeName");
    this.toolsProvider.getUserData().then((r)=>{
      if(r != null) {
        this.userinfo.username = r.username;
        this.userinfo.userfullname = r.userfullname;
        
      }else {
        this.events.publish("logout","logout");
      }
    })
    
    this.loadFormData();
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OaexcutingPage');
  }

  public loadFormData() {
    
    
    var instId :string = this.navParams.get("instId");
    var taskInstId :string = this.navParams.get("taskInstId");
    var userId :string = this.navParams.get("userId");
   

    var url:string = "/uapi/task/doing?instId=" + instId + "&taskInstId="+taskInstId + "&userId=" + userId;
    this.httpServicesProvider.doGet(url,(result) => {
      console.log("attachzw=" + JSON.stringify(result));
        if(result.code == '0') {
          this.formextValueRepresentationMobile = result.formext;
          //var processDefinition = result.processDefinition;
          //var processInstance = result.processInstance;
          //var userTask = result.userTask;
          //var bizDocument = result.bizDocument;

          this.formextValueRepresentationMobile.fromTaskId = result.fromTaskId;
          this.formextValueRepresentationMobile.fromTaskNodeId = result.fromTaskNodeId;
          this.formextValueRepresentationMobile.fromTaskNodeName = result.fromTaskNodeName;
          this.formextValueRepresentationMobile.curTaskFormKey = result.curTaskFormKey;
          this.formextValueRepresentationMobile.bizDocId = result.bizDocId;
          this.formextValueRepresentationMobile.bizDocTitile = result.bizDocTitile;

          this.bizData = this.formextValueRepresentationMobile.bizData;
          this.spData = this.formextValueRepresentationMobile.spData;
          for(var key in this.formextValueRepresentationMobile) {
              if(key != "bizData" && key != "spData") {
                //复制基本信息
                this.formextValueRepresentation[key] = this.formextValueRepresentationMobile[key];
              }

          }
          this.bizattachzw.attachName = "";
          this.bizattachzw.processInstId = ""
          this.bizattachzw.id = "-1";
          console.log("before ="+ JSON.stringify(this.bizattachzw))
         
          
          this.bizattachzw.attachName = result.bizdoczw.attachName;
          this.bizattachzw.processInstId = result.bizdoczw.processInstId;
          this.bizattachzw.id = result.bizdoczw.id;
          console.log("after"+JSON.stringify(this.bizattachzw))
          
          

        }
        
    });

    

  }

  public getKeys(obj):Array<string> {
    var result:Array<string> = [];
    for(let key in obj) result.push(key);
    return result;

  }

  

  

  public wfSend(actionCode) {
    var final_bizData = {};//最终提交的业务数据
    var final_spData = {};//最终提交的审批数据
    final_bizData = this.handBizData(actionCode);
    final_spData = this.handleSpData(actionCode) ;
    this.formextValueRepresentation.bizData = final_bizData;
    this.formextValueRepresentation.spData = final_spData;

    //alert(JSON.stringify(this.formextValueRepresentation))
    var url = '/uapi/task/bizsave?userId='+ this.userinfo.username;
    this.httpServicesProvider.doPost(url,this.formextValueRepresentation,(r)=>{
      var msg = r.msg;
      var code = r.code;
      if(code == '0') {
        this.showInfo(msg);
        this.events.publish("subpage:pop",msg);
        
      }

    });
   
    

    
  }

  
  
  
  //处理业务数据
  public handBizData(actionCode) {
    var final_bizData = {};//最终提交的业务数据
    for(let key in this.bizData) {
      let t_BizData_item = {
        "name":'',
        "value":'',
        "userId":'',
        "userName":'',
        "bizDate":'',
        "nodeDefId":''
        
      };
      
      let bizData_item = this.bizData[key];
      
      for(let k in t_BizData_item) {
        t_BizData_item[k] = bizData_item[k];
      }
      final_bizData[key] = t_BizData_item;


    }

    return final_bizData;
  }


  //处理审批数据
  public handleSpData(actionCode) {
    var final_spData = {};//最试图提交的审批数据

    for(let key in this.spData) {
      let bizData_key_values = [];
      let spData_item = this.spData[key];
      for(let i = 0; i < spData_item.length; i++) {
        let spData_item_single = spData_item[i];
        let t_SpData = {
          "name":'',
          "value":'',
          "userId":'',
          "userName":'',
          "spDate":'',
          "nodeDefId":'',
          "nodeInstId":'',
          "actionCode":''
    
        };
        for(let k in t_SpData) {
          t_SpData[k] = spData_item_single[k];
        }
        if(t_SpData['value'] != "" && t_SpData['nodeInstId']=='-1') {
          t_SpData['userId'] = this.userinfo.username;
          t_SpData['userName'] = this.userinfo.userfullname;
          t_SpData['spDate'] = this.toolsProvider.formatDate('yyyy-MM-dd hh:mm:ss',new Date());
          t_SpData['nodeDefId'] = this.formextValueRepresentationMobile.fromTaskNodeId;
          t_SpData['nodeInstId'] = this.formextValueRepresentationMobile.fromTaskId;
          t_SpData['actionCode'] = actionCode;
        }
        if(t_SpData['value'] != "" && t_SpData['nodeInstId']!='-1') {
          bizData_key_values.push(t_SpData);
        }
      }
      if(bizData_key_values.length > 0) {
        final_spData[key] = bizData_key_values;
      }

    }

    return final_spData;

  }


  //提示信息
  showInfo(msg){
    const alert = this.alertCtl.create({
      title: '信息',
      subTitle: msg,
      buttons: [{text:'确定',handler:()=>{
        this.navCtrl.pop();
      }
    }]
    });
    alert.present();



  }


  

  doneBizAttachZW(bizattachzw) {
    var fileext = this.toolsProvider.getFileType(bizattachzw.attachName);
    var mineType = this.toolsProvider.getFileMimeType(fileext)
    var app;
    var uri;
    const transfer: FileTransferObject = this.fileTransfer.create();
    const url = this.configProvider.apiUrl + "/uapi/zw/download?id="+bizattachzw.id
    var fileName= bizattachzw.attachName;
    transfer.download(url, this.file.dataDirectory + bizattachzw.processInstId + "."+ fileext).then((entry) => {
      
      uri = entry.toURL();
      
      //alert(uri);
      if (this.platform.is('ios')) {
        app = 'KingSoftOfficeApp://';
      } else if (this.platform.is('android')) {
       // app = 'com.kingsoft.moffice_pro';
        app = 'cn.wps.moffice_eng';
      }
      
      this.fileOpener.open(entry.toURL(), mineType)
      .then(() => alert('File is opened'))
      .catch(e => alert('Error openening file'));
    
  
    
   
    //  this.appAvailability.check(app).then(
        
    //     (yes: boolean)=>{

    //       try{
    //         alert(url)
    //         var sApp = startApp.set({
    //           "flags":["FLAG_ACTIVITY_NEW_TASK"],
    //           "action":"ACTION_VIEW",
    //           "type":mineType,
    //           "uri":url,
    //           "component": [app,"cn.wps.moffice.documentmanager.PreStartActivity2"]
             
    //         }, {
              
    //           "OpenMode":"EditMode",
    //           "SendSaveBroad":true,
    //           "ThirdPackage":"io.ionic.starter",
    //           "ClearTrace":true,
    //           "UserName": this.userinfo.userfullname
              
    //         }).start(function() { /* success */
    //           console.log("OK");
    //         }, function(error) { /* fail */
    //           alert(error);
    //         }, function() { // optional broadcast and forResult callback
    //           console.log(arguments);
    //         });

    //       }catch(e) {
    //         alert(e);
    //       }
         
  
    //     },(no: boolean)=>{
    //       alert("没安装WPS专业版，请安装");
    //     }
    //   );
  
      
      
    }, (error) => {
      // handle error
      //alert(error.code);
    });

   }

}
