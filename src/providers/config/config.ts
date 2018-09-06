
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  //api请求地址
  public apiUrl="http://192.168.0.135:8080/mgr";

  public JPUSH_APP_KEY="eebfe9e49538b1a41bc5d721";

  public JPUSH_GLOBLE_GROUPID="12280670";

  constructor() {
    console.log('Hello ConfigProvider Provider');
  }

}
