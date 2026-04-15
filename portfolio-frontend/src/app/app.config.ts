import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { Observable } from 'rxjs';

// Custom TranslateLoader
// En app.config.ts
// Custom TranslateLoader
class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // AGREGAMOS LA BARRA INICIAL '/'
    return this.http.get(`/assets/i18n/${lang}.json`); 
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      },
      // CAMBIAMOS defaultLanguage POR fallbackLang
      fallbackLang: 'es' 
    })
  ]
};
