import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- Agregarlo aquí
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  // Aquí guardaremos lo que escribas en el modal
  credenciales: any = { username: '', password: '' };
  estaLogueado: boolean = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Escuchamos el megáfono para saber si estamos adentro o afuera
    this.authService.isLoggedIn$.subscribe(estado => {
      this.estaLogueado = estado;
      this.cdr.detectChanges();
    });
  }

  iniciarSesion() {
    this.authService.login(this.credenciales).subscribe({
      next: (respuesta) => {
        alert('¡Bienvenido ' + respuesta.usuario + '!');
        this.authService.setLoggedIn(true);
        
        // Limpiamos los campos
        this.credenciales = { username: '', password: '' };

        // OBLIGAMOS A LA PANTALLA A ACTUALIZARSE AHORA MISMO
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
  cerrarSesion() {
    this.authService.setLoggedIn(false);
    alert('Has cerrado sesión exitosamente.');
    this.cdr.detectChanges(); // <-- Agrega esto aquí también
  }
}
