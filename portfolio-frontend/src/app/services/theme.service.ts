import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;
  private currentLang = 'es';
  private currentLangSubject = new BehaviorSubject<string>(this.currentLang);
  public language$ = this.currentLangSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
      this.applyTheme();

      const savedLang = localStorage.getItem('language') || 'es';
      this.setLanguage(savedLang);
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;
    body.classList.toggle('dark', this.isDarkMode);
    body.classList.toggle('dark-theme', this.isDarkMode);
    html.classList.toggle('dark', this.isDarkMode);
  }

  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.currentLangSubject.next(lang);
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  isDark(): boolean {
    return this.isDarkMode;
  }
}