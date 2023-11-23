import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantity'
})
export class quantityPipe implements PipeTransform {

  transform(value:any,item1:any, ...args: unknown[]): unknown {
    console.log('hàm này đã được gọi')
    let tsl: number = 0;
    let id:number=1;
    value.forEach((item:{soluong:any,id:Number}) => {
      
      if (item.id == item1.id) {
        
        tsl += item.soluong

      }
      
    })
    
    return tsl;
  }

}