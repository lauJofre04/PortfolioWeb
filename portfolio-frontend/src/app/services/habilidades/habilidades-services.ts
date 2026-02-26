import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HabilidadesServices {
  // La URL que apunta a tu backend en Node para Habilidades
  private apiUrl = 'http://localhost:3000/api/habilidades';

  constructor(private http: HttpClient) { }

  // Obtener todas las habilidades (GET)
  getHabilidades(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Agregar una nueva habilidad (POST)
  crearHabilidad(habilidad: any): Observable<any> {
    return this.http.post(this.apiUrl, habilidad);
  }

  // Editar una habilidad existente (PUT)
  editarHabilidad(id: number, habilidad: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, habilidad);
  }
}
