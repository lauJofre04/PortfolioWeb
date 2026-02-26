import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectosServices {
  // La URL que apunta a tu backend en Node para Proyectos
  private apiUrl = 'http://localhost:3000/api/proyectos';

  constructor(private http: HttpClient) { }

  // Obtener todos los proyectos (GET)
  getProyectos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Agregar un nuevo proyecto (POST)
  crearProyecto(proyecto: any): Observable<any> {
    return this.http.post(this.apiUrl, proyecto);
  }

  // Editar un proyecto existente (PUT)
  editarProyecto(id: number, proyecto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proyecto);
  }
}
