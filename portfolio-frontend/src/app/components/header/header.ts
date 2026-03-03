import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  credenciales: any = { username: '', password: '' };
  credencialesRegistro: any = { username: '', password: '' }; // <-- Para el modal de registro

  estaLogueado: boolean = false;
  rolActual: string = ''; // <-- Para guardar tu rol

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(estado => {
      this.estaLogueado = estado;
      this.cdr.detectChanges();
    });

    // NUEVO: Escuchamos el rol
    this.authService.userRole$.subscribe(rol => {
      this.rolActual = rol;
      this.cdr.detectChanges();
    });
  }

  iniciarSesion() {
    this.authService.login(this.credenciales).subscribe({
      next: (respuesta) => {
        alert('¡Bienvenido ' + respuesta.usuario + '! Tu rol es: ' + respuesta.rol);
        
        // 1. GUARDAMOS EL TOKEN EN LA MEMORIA DEL NAVEGADOR
        localStorage.setItem('token', respuesta.token); 
        
        this.authService.setLoggedIn(true, respuesta.rol);
        this.credenciales = { username: '', password: '' };
        this.cdr.detectChanges(); 
      },
      // ... error ...
    });
  }

  // NUEVA FUNCIÓN: Para registrar usuarios
  registrarse() {
    this.authService.registro(this.credencialesRegistro).subscribe({
      next: (respuesta) => {
        alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
        this.credencialesRegistro = { username: '', password: '' }; // Limpiamos
        this.cdr.detectChanges();
      },
      error: (error) => {
        alert('Hubo un error al registrar el usuario.');
      }
    });
  }

  cerrarSesion() {
    // 2. ROMPEMOS LA PULSERA AL SALIR
    localStorage.removeItem('token'); 
    
    this.authService.setLoggedIn(false, '');
    alert('Has cerrado sesión exitosamente.');
    this.cdr.detectChanges(); 
  }
}