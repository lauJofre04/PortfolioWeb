import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  private apiUrl = 'http://localhost:3000/api/experiencia'; // Apunta a experiencia

  constructor(private http: HttpClient) { }

  getExperiencia(): Observable<any> { return this.http.get(this.apiUrl); }
  crearExperiencia(exp: any): Observable<any> { return this.http.post(this.apiUrl, exp); }
  editarExperiencia(id: number, exp: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, exp); }
}