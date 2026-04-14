import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;
  private currentLang = 'es';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Cargar preferencia de tema desde localStorage
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();

      // Cargar idioma desde localStorage
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
    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;
      if (this.isDarkMode) {
        body.classList.add('dark-theme');
      } else {
        body.classList.remove('dark-theme');
      }
    }
  }

  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  isDark(): boolean {
    return this.isDarkMode;
  }
}