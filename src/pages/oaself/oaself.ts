import { ToolsProvider } from './../../providers/tools/tools';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';


/**
 * Generated class for the OaselfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oaself',
  templateUrl: 'oaself.html',
})
export class OaselfPage {
  public userinfo = {
    username: '',
    password: '',
    userfullname: '',
    userdeptname: '',
    userrolesname:''
  };


  constructor(
    public navCtrl: NavController, 
    public toolsProvider : ToolsProvider,
    public  events:  Events,
    public navParams: NavParams) {

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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OaselfPage');
    console.log('ionViewDidLoad this.userinfo.username'+this.userinfo.username);
  }

}
