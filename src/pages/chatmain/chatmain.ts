import { ConfigProvider } from './../../providers/config/config';
import { ChatPage } from './../chat/chat';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JMessagePlugin, JMConversationInfo,JMUserInfo,JMGroupInfo,JMAllType, JMError } from '@jiguang-ionic/jmessage';



/**
 * Generated class for the ChatmainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatmain',
  templateUrl: 'chatmain.html',
})
export class ChatmainPage {

  public ctype:number;//1 会话 2 朋友　3　群组
  public conversationList: JMConversationInfo[];;
  public friendList: JMUserInfo[];
  public groupmembers: JMUserInfo[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public configProvider: ConfigProvider,
    public jmessage: JMessagePlugin) {
    this.ctype = 1;
    this.getJGMessage(this.ctype);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatmainPage');
  }

  showList(t_type:number) {
    console.log("t_type=" + t_type);
    this.ctype = t_type;
    this. getJGMessage(this.ctype);
  }


  getJGMessage(ctype) {
    if(ctype == 1) {
      this.jmessage.getConversations()
      .then( (conversationList: JMConversationInfo[]) => {
        console.log("jmessage.getConversations():" + JSON.stringify(conversationList));
        this.conversationList = conversationList;
      })
      .catch( (error: JMError ) => {
        console.log(JSON.stringify(error));
      });
    }else if(ctype == 2) {
      this.jmessage.getGroupMembers({id:''+ this.configProvider.JPUSH_GLOBLE_GROUPID})
      .then( (groupfriends) => {
        console.log("jmessage.getFriends():" + JSON.stringify(groupfriends));
        this.groupmembers = groupfriends;
        
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
    }else if(ctype == 3) {
     
      this.jmessage.getFriends().then((friends) => {
        console.log("jmessage.getFriends():" + JSON.stringify(friends));
        this.friendList = friends;
      }).catch(err => {
        console.log(JSON.stringify(err));
      });
    }

  }


  enterChat(conversationInfo: JMConversationInfo) {
    this.navCtrl.push(ChatPage, conversationInfo);
  }


  enterUser(friend: JMUserInfo) {

    this.jmessage.createConversation({
      type: 'single',
      username: friend.username
    }).then( (conversation) => {
      this.navCtrl.push(ChatPage,conversation);
    }).catch(err => {
      console.log(JSON.stringify(err));
    });
    
  }

  enterUser1(friend: JMUserInfo) {
    
       
          this.navCtrl.push(ChatPage);
       
        
  }

  
  deleteConversation(conversation: JMConversationInfo) {
    let deleteObj :JMAllType;
    switch (conversation.conversationType) {
      case 'single':
        let user: JMUserInfo = conversation.target;
        deleteObj = {
          type: 'single',
          username: user.username
        } ;
        break;
      case 'group':
        let group: JMGroupInfo = conversation.target;
        deleteObj= {
          type: 'group',
          groupId: group.id
        };
        break;
      default:
        break;

    }

    this.jmessage.deleteConversation(deleteObj).then((r)=>{
      this.getJGMessage(1);
    }).catch((e=>{
      console.log(JSON.stringify(e));
    }));

  }

}
