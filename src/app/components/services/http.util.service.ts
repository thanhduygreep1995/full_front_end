import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilService {
  constructor(private languageService: LanguageService){}
  createHeaders(): HttpHeaders {
    const currentLanguage = this.languageService.getCurrentLanguage();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': currentLanguage,
    });
  }
}
