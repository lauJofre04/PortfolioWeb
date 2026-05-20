import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService {
  private apiUrl = environment.apiUrl + '/api/presentacion';

  constructor(private http: HttpClient) { }

  getPresentacion(lang: string = 'es'): Observable<any> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get(this.apiUrl, { params });
  }
}
