import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // <-- Importamos BehaviorSubject

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login';

  // 1. Creamos el estado (por defecto es 'false' porque empezamos sin loguearnos)
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  
  // 2. Creamos un "observable" que los demás componentes van a escuchar
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient) { }

  login(credenciales: any): Observable<any> {
    return this.http.post(this.apiUrl, credenciales);
  }

  // 3. Esta función se llama cuando el login es exitoso
  setLoggedIn(estado: boolean) {
    this.isLoggedIn.next(estado);
  }
}