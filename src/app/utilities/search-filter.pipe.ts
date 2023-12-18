import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(allProduct: any, search_rule: any): any {
    if(search_rule == '' || search_rule == null || search_rule == undefined) return allProduct;
    const result = allProduct.filter((item: any) => {
      const containtInDescription = item.description ? item.description.toLowerCase().includes(search_rule.toLowerCase()) : false;
      const containtInModel = item.model ? item.model.toLowerCase().includes(search_rule.toLowerCase()) : false;
      const containtInName = item.name ? item.name.toLowerCase().includes(search_rule.toLowerCase()) : false;
      if (containtInDescription || containtInModel || containtInName) return item;
    })
    return result;
  }

}
