import { ConfigProvider } from './../../providers/config/config';
import { UserInfo } from './../../module/user_vo';
import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { TabsPage } from './../tabs/tabs';
import { ToolsProvider } from './../../providers/tools/tools';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { JMessagePlugin, JMError } from '@jiguang-ionic/jmessage';





/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
   userinfo = {
    username: '',
    password: '',
    userfullname: ''
  };

  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toolsProvider :ToolsProvider,
    public toastCtrl: ToastController,
    public configProvider :ConfigProvider,
    public jmessage: JMessagePlugin,
    public httpServicesProvider: HttpServicesProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {

    //const toolsProvider: ToolsProvider = this.toolsProvider;
    if(this.userinfo.username == '' || this.userinfo.password == '') {
      this.toolsProvider.showToast('top','帐号与密码都不能为空');

        
    }else {
      var url = '/uapi/login?username=' + this.userinfo.username 
      + '&password=' + this.userinfo.password
      + '&mp=1';
      

      this.httpServicesProvider.doPost(url,null,(result)=>{
        if(result.code == 0) {
          this.userinfo.userfullname = result.userfullname;
          let userInfo_vo:UserInfo = new UserInfo(
            this.userinfo.username,
            this.userinfo.userfullname,
            '','','',''
          );
         let tusername = this.userinfo.username+"_msg";
         let tusernickname = this.userinfo.userfullname;
         this.messageProcess(userInfo_vo);
          //this.toolsProvider.savaUserInfo(this.userinfo);
          this.toolsProvider.savaUserData(userInfo_vo);
          this.toolsProvider.showToast('top','欢迎进入系统');
          this.navCtrl.setRoot(TabsPage);

        }else{
         this.toolsProvider.showToast('top','帐号或密码错误');
        }

        
      });

      
    }
    
  }

  //极光用户登录处理
  messageProcess(userInfo_vo:UserInfo){
    try{
      var userModel = {
        username:userInfo_vo.username+"_msg",
        password:'123456',
        nickname:userInfo_vo.userfullname
      };

      this.jmessage.register(userModel).then((r=>{
        console.log("jmessage register() :  ok=" + JSON.stringify(r));
        this.loginMessage(userModel.username);
        
      })).catch((err=>{
        console.log("jmessage register() :  fail=" + JSON.stringify(err));
        var description = 'user exist';
        if(err.description == description) {
          this.loginMessage(userModel.username);
          
        }
      }));

    }catch(e){
      console.log("err="+e);
    }
    


  }

  

  loginMessage(username) {
    this.jmessage.login({username:username,password:'123456'}).then((r)=>{
      console.log("jmessage login() :  " + username + "  ok");
      this.addCurrentUserToGroup(username);
      
    }).catch((err=>{
      console.log("jmessage login() : " + username + "  fail");
    }));
  }


  addCurrentUserToGroup(username) {
    //12280670指定群
    let usernameArray:string[] = [username];
    this.jmessage.addGroupMembers(
      {
        id:'' + this.configProvider.JPUSH_GLOBLE_GROUPID,
        usernameArray:usernameArray
      }
    )
    .then((r)=>{
      console.log("jmessage addGroupMembers("+ this.configProvider.JPUSH_GLOBLE_GROUPID + ") :"  + username + "  ok="+JSON.stringify(r));
    })
    .catch((err=>{
      console.log("jmessage addGroupMembers(" + this.configProvider.JPUSH_GLOBLE_GROUPID + ") :" + username + "  fail=" + JSON.stringify(err));
    }))
    

  }

 
 

}


