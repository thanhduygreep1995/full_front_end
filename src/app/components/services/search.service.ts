

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSource = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTermSource.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }


  search(keyword: string,listProduct: any): Observable<string[]> {
    if (typeof keyword === 'string') {
      if(listProduct.length == 0)return of([]);
      let filteredData = listProduct.filter((item:any) => item.toLowerCase().includes(keyword.toLowerCase()));
      if(filteredData.length > 10){
        filteredData = filteredData.slice(0,9);
      }
      return of(filteredData);
    } else {
      // Trường hợp khác, có thể xử lý hoặc trả về một giá trị mặc định
      console.warn('Invalid keyword type:', typeof keyword);
      return of([]);
    }
  }
}