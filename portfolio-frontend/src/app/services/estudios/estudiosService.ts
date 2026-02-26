import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {
  private apiUrl = 'http://localhost:3000/api/estudios';

  constructor(private http: HttpClient) { }

  // Obtener lista
  getEstudios(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Crear nuevo
  crearEstudio(estudio: any): Observable<any> {
    return this.http.post(this.apiUrl, estudio);
  }

  // Editar existente
  editarEstudio(id: number, estudio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estudio);
  }

  // Borrar (opcional por ahora, pero útil)
  borrarEstudio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}