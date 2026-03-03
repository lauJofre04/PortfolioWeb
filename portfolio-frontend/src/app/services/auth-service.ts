import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlLogin = 'http://localhost:3000/api/login';
  private apiUrlRegistro = 'http://localhost:3000/api/registro'; // <-- Nueva ruta

  // 1. Estado de si está adentro o no
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  // 2. NUEVO: Estado para saber qué rol tiene ('admin' o 'invitado')
  private userRole = new BehaviorSubject<string>('');
  userRole$ = this.userRole.asObservable();

  constructor(private http: HttpClient) {
    this.recuperarSesion();
   }

   // ==========================================
  // NUEVA FUNCIÓN: EL RESTAURADOR DE SESIÓN
  // ==========================================
  private recuperarSesion() {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Los JWT tienen 3 partes separadas por puntos. La parte del medio (índice 1) tiene nuestros datos.
        // Usamos atob() para decodificar esa información y JSON.parse para convertirla en un objeto de JS.
        const payloadDecodificado = JSON.parse(atob(token.split('.')[1]));
        
        // Recuperamos el rol que guardamos en Node.js al crear el token
        const rolGuardado = payloadDecodificado.rol;
        
        // ¡Encendemos el megáfono y le avisamos a toda la página que seguimos logueados!
        this.setLoggedIn(true, rolGuardado);
      } catch (error) {
        // Si el token está corrupto, por seguridad limpiamos todo
        localStorage.removeItem('token');
        this.setLoggedIn(false, '');
      }
    }
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(this.apiUrlLogin, credenciales);
  }

  // NUEVA FUNCIÓN: Para enviar los datos de registro
  registro(credenciales: any): Observable<any> {
    return this.http.post(this.apiUrlRegistro, credenciales);
  }

  // ACTUALIZADA: Ahora recibe también el rol
  setLoggedIn(estado: boolean, rol: string = '') {
    this.isLoggedIn.next(estado);
    this.userRole.next(rol);
  }
}