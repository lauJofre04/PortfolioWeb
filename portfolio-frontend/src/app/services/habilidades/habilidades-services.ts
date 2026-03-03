import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HabilidadesServices {
  // La URL que apunta a tu backend en Node para Habilidades
  private apiUrl = environment.apiUrl+'/api/habilidades';

  constructor(private http: HttpClient) { }

  private crearCabecera() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Tiene que decir 'Bearer ' seguido del token
    });
  }

  // Obtener todas las habilidades (GET)
  getHabilidades(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Agregar una nueva habilidad (POST)
  crearHabilidad(habilidad: any): Observable<any> {
    return this.http.post(this.apiUrl, habilidad,{ headers: this.crearCabecera() });
  }

  // Editar una habilidad existente (PUT)
  editarHabilidad(id: number, habilidad: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, habilidad,{ headers: this.crearCabecera() });
  }
  borrarHabilidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers: this.crearCabecera() });
  }
}
