import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguage!: string;

  constructor(private translate: TranslateService) {}

  setInitialAppLanguage() {
    const savedLanguage = localStorage.getItem('Accept-Language');
    if (savedLanguage) {
      this.translate.use(savedLanguage);
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
  }
  getCurrentLanguage(): string {
    return localStorage.getItem('Accept-Language') || 'en';
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('Accept-Language', language);
  }
}
