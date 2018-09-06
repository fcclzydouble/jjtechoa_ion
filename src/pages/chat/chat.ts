import { ToolsProvider } from './../../providers/tools/tools';
import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, LoadingController, Loading, Content,ModalController } from 'ionic-angular';
import { JMessagePlugin, JMConversationInfo, JMError, JMUserInfo, JMGroupInfo, JMAllMessage, JMImageMessage, JMAllType, JMVoiceMessage } from '@jiguang-ionic/jmessage';
import { JsonPipe } from '@angular/common';
import { File, IWriteOptions } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Media, MediaObject } from '@ionic-native/media';
import { PhotoViewer } from '@ionic-native/photo-viewer';


/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  public loader: Loading;
  public conversationType: JMAllType;
  
  public voiceFile: MediaObject;
  public voicePath: string;
  public isRecording: boolean;

  public text: string;
  public editorMsg:string;

  public conversation: JMConversationInfo;
  public messageList: JMAllMessage[];

  public showEmojiPicker = false;

  public cuser_avator = "assets/imgs/user.jpg";
  public tuser_avator = "assets/imgs/to-user.jpg";

  // 用于储存 图片数据（base64）    messageId: string
  public imageMap: {
    [key: string]: string;
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toolsProvider: ToolsProvider,
    public jmessage: JMessagePlugin,
    public modalCtrl: ModalController,
    public platform: Platform,
    private camera: Camera,
    public photoViewer: PhotoViewer,
    public loadingCtrl: LoadingController,
    private media: Media,
    private file: File) {

      this.conversation = <JMConversationInfo>(new Object(navParams['data']));
      
      this.imageMap = {};
      this.isRecording = false;
      this.conversationType = this.getCurrentConversationTarget();

      this.getHistoryMessages({
        ...this.conversationType,
        from: 0,
        limit: 20,
      });
      
      this.jmessage.addReceiveMessageListener( message => {
        if (this.isThisConversationMessage(message)) {
          
          if (message.type == 'image') {

            this.getImageDataFromPath(`file://${(<JMImageMessage>message).thumbPath}`).then(res => {
              this.imageMap[message.id] = res;  

              this.messageList.push(message);  
            }).catch(err => {
              console.log("" + JSON.parse(err));
            });
          } else {
            this.messageList.push(message);
          }
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }


  private getCurrentConversationTarget(): JMAllType {
    switch (this.conversation.conversationType) {
      case 'single':
      let user: JMUserInfo = this.conversation.target;
        return {
          type: 'single',
          username: user.username
        } 
      case 'group':
      let group: JMGroupInfo = this.conversation.target;
      return {
        type: 'group',
        groupId: group.id
      }
      default:
        break;
    }

  }


  /**得到历史消息 */
  private async getHistoryMessages(params: any): Promise<any> {
    let messageList = await this.jmessage.getHistoryMessages(params);

     let allPromise:(Promise<JMAllMessage>)[] = messageList.map(async (message: JMAllMessage) => {
      if (message.type == 'image') {
        if (message.thumbPath == undefined || message.thumbPath == '') {
          let result = await this.jmessage.downloadThumbImage({
            type: params.type,
            messageId: message.id,
            username: params.username,
            appKey: null,
            groupId: params.groupId
          });
        }

        this.imageMap[message.id] = await this.getImageDataFromPath(`file://${message.thumbPath}`);
      } else {
        return message;
      }
    });
    await Promise.all(allPromise).catch(err => {
      alert(JSON.stringify(err));
    });
    this.messageList = messageList;    
  }


  /**得到图片 */
  private async getImageDataFromPath(path: string): Promise<string> {
    let dir = path.split( '/' ).slice( 0, -1 ).join( '/' );
    let name = path.split( '/' ).slice(-1)[0];
    const promise = new Promise<string>(resolve => {
      this.file.readAsDataURL(dir, name).then(res => {
        resolve(res);
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
    });
    return promise;
  }


  private scrollToBottom() {
    this.content.scrollToBottom();
  }


  private onSendText() {
    if (this.text == '') {
      return;
    } 
    
    const conversationType = this.getCurrentConversationTarget();
    //alert(JSON.stringify(conversationType));
    this.jmessage.sendTextMessage({
      ...conversationType,
      text: this.text,
      extras:{
        sendtime: ''+ this.toolsProvider.formatDate('yyyy-MM-dd hh:mm:ss')
      }
    }).then( (msg) => {
      this.messageList.push(msg);
      this.scrollToBottom;
      
    }).catch(err => {
      console.log(JSON.stringify(err));
    });
    this.text = '';
    if (!this.showEmojiPicker) {
      this.focus();
    }
  }


  private onTakePicture() {
    this.takePickture();
  }


  private takePickture() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
     let date = new Date();
     let name = date.getTime();
      
    this.camera.getPicture(options)
      .then((imagePath) => {

        let dir = imagePath.split( '/' ).slice( 0, -1 ).join( '/' );
        let name = imagePath.split( '/' ).slice(-1)[0];


        let imgPath = imagePath.replace('file://','');
          this.showLoading('正在发送图片');
          this.jmessage.sendImageMessage({
            ...this.conversationType,
            path: imgPath,
            extras:{
              sendtime: ''+ this.toolsProvider.formatDate('yyyy-MM-dd hh:mm:ss')
            }
          })
          .then(message => {
            this.getImageDataFromPath(`file://${(<JMImageMessage>message).thumbPath}`).then(res => {
              this.imageMap[message.id] = res;
              this.messageList.push(message);  
              this.scrollToBottom;
            }).catch(err => {
              alert(JSON.parse(err));
            });
            this.loader.dismiss();
          })
          .catch(err => {
            this.loader.dismiss();
            alert(JSON.stringify(err));
          });
      }, (err) => {
      })
      .catch(err => {
        alert('err: ' + JSON.stringify(err));
      });
  }


  private showLoading(text: string) {
    this.loader = this.loadingCtrl.create({
      content: text
    });
    
    this.loader.present();
  }


  private isThisConversationMessage(message: JMAllMessage): boolean {
    
    if (message.type === 'event') { return; }

    if (this.conversation.conversationType == 'single') {
      let user: JMUserInfo = this.conversation.target;
      
      if (message.from.username === user.username) {
        return true;
      } else {
        return false;
      }
    } else {

      let group: JMGroupInfo = this.conversation.target;
      let messageGroup: JMGroupInfo = <JMGroupInfo>message.target;
      if (messageGroup.id === group.id) {
        return true;
      } else {
        return false;
      }
    }
  }


  private onRecordBtn() {
    
    if (this.isRecording) {
      this.didRecordVoice();
    } else {
      this.recordVoice()
    }
    this.isRecording = !this.isRecording;
  }


  private recordVoice() {
    
        let date = new Date();
        let name = date.getTime();
        
        let dir = this.file.cacheDirectory.replace('file://','');
        let fileName = '';
        if (this.platform.is('ios')) {
          fileName = `${name.toString()}.m4a`;
          this.voicePath = `${dir}${fileName}`;
          this.file.createFile(this.file.cacheDirectory, fileName, true)
          .then(() => {
            this.voiceFile = this.media.create(this.voicePath);
            this.voiceFile.startRecord();
          }).catch(err => {
            alert(JSON.stringify(err));
          });
        } else {
          dir = `${this.file.externalDataDirectory.replace('file://', '')}`
          fileName = `${name.toString()}.3gp`
          this.voicePath = `${dir}${fileName}`;
          this.voiceFile = this.media.create(this.voicePath);
          this.voiceFile.startRecord();
        }
      }
    
      private didRecordVoice() {
        this.voiceFile.stopRecord();
        if (this.platform.is('android')) {
          this.voiceFile.release();
        }
        this.playVoice(this.voicePath);
        console.log(`did recording ${this.voicePath}`);
        this.jmessage.sendVoiceMessage({
          ...this.conversationType,
          path: this.voicePath,
          extras:{
            sendtime: ''+ this.toolsProvider.formatDate('yyyy-MM-dd hh:mm:ss')
          }
        })
        .then(message => {
          this.messageList.push(message);
          this.scrollToBottom;
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
      }


      private playVoice(path: string) {
        this.voiceFile = this.media.create(path);
        
        this.voiceFile.play();
      }


      private onVoiceMessageContent(message) {
        this.playVoice((<JMVoiceMessage>message).path);
      }


      switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
          this.focus();
        } else {
          this.setTextareaScroll();
        }
        this.content.resize();
        this.scrollToBottom();
      }


      private focus() {
        if (this.messageInput && this.messageInput.nativeElement) {
          this.messageInput.nativeElement.focus();
        }
      }
    
      private setTextareaScroll() {
        const textarea =this.messageInput.nativeElement;
        textarea.scrollTop = textarea.scrollHeight;
      }


      onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
      }

      public toViewPic(url) {
       this.photoViewer.show(url);
      }


}
