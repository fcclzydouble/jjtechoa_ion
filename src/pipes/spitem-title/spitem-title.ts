import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SpitemTitlePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'spitemTitle',
})
export class SpitemTitlePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
  
      var t_a = value;
      for(var i = 0; i < t_a.length;i++) {
        return t_a[i].title;
      
    }
    return "";
  }
}
