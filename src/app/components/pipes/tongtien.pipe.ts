import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tongtien'
})
export class TongtienPipe implements PipeTransform {

  transform(value:any, ...args: unknown[]): unknown {
    console.log('oke')
    let tt: number = 0;
    value.forEach((item: { tongTien: any; }) => tt = tt + Number(item.tongTien));
    return tt;
  }

}