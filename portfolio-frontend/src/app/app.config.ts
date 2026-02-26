import { ApplicationConfig,  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <--- Verifica esta línea
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    
    provideRouter(routes),
    provideHttpClient() // <--- Asegúrate de que tenga los paréntesis () y la coma arriba
  ]
};