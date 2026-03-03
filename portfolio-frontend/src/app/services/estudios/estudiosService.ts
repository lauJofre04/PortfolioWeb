import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {
  private apiUrl = environment.apiUrl+'/api/estudios';

  constructor(private http: HttpClient) { }

  // NUEVA FUNCIÓN: Busca la pulsera y la prepara para enviarla
  private crearCabecera() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Tiene que decir 'Bearer ' seguido del token
    });
  }
  // Obtener lista
  getEstudios(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Crear nuevo
  crearEstudio(estudio: any): Observable<any> {
    return this.http.post(this.apiUrl, estudio,{ headers: this.crearCabecera() });
  }

  // Editar existente
  editarEstudio(id: number, estudio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estudio,{ headers: this.crearCabecera() });
  }

  // Borrar (opcional por ahora, pero útil)
  borrarEstudio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers: this.crearCabecera() });
  }
}