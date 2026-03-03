import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  private apiUrl = '${environment.apiUrl}/api/experiencia'; // Apunta a experiencia

  constructor(private http: HttpClient) { }

  private crearCabecera() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Tiene que decir 'Bearer ' seguido del token
    });
  }

  getExperiencia(): Observable<any> { return this.http.get(this.apiUrl); }
  crearExperiencia(exp: any): Observable<any> { return this.http.post(this.apiUrl, exp,{ headers: this.crearCabecera() }); }
  editarExperiencia(id: number, exp: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, exp,{ headers: this.crearCabecera() }); }
  borrarExperiencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers: this.crearCabecera() });
  }
}