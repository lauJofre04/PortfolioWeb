import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProyectosServices {
  // La URL que apunta a tu backend en Node para Proyectos
  private apiUrl = environment.apiUrl+'/api/proyectos';

  constructor(private http: HttpClient) { }

  private crearCabecera() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Tiene que decir 'Bearer ' seguido del token
    });
  }

  // Obtener todos los proyectos (GET)
  getProyectos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Agregar un nuevo proyecto (POST)
  crearProyecto(proyecto: any): Observable<any> {
    return this.http.post(this.apiUrl, proyecto,{ headers: this.crearCabecera() });
  }

  // Editar un proyecto existente (PUT)
  editarProyecto(id: number, proyecto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proyecto,{ headers: this.crearCabecera() });
  }
  borrarProyectos(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers: this.crearCabecera() });
  }
}
