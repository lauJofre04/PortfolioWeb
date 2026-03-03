import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HabilidadesServices } from '../../services/habilidades/habilidades-services';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-habilidades',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './habilidades.html',
  styleUrl: './habilidades.css',
})
export class Habilidades {
  // Variables principales
  misHabilidades: any[] = [];
  formHab: any = { nombre: '', porcentaje: '', icono_url: '' };
  esEdicion: boolean = false;
  idEdicion: number | null = null;
  estaLogueado: boolean = false;
  esAdmin: boolean = false; // <--- NUEVA VARIABLE

  constructor(
    private habService: HabilidadesServices,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ){}

  


  ngOnInit(): void {
    this.cargarHabilidades();

    // Escuchamos si está logueado
    this.authService.isLoggedIn$.subscribe(estado => {
      this.estaLogueado = estado;
      this.cdr.detectChanges();
    });

    // NUEVO: Escuchamos qué rol tiene
    this.authService.userRole$.subscribe(rol => {
      this.esAdmin = (rol === 'admin'); // Será true solo si el rol es 'admin'
      this.cdr.detectChanges();
    });
  }
  // Funciones (iguales a las anteriores, pero llamando a habService)
  cargarHabilidades() {
    this.habService.getHabilidades().subscribe(data => {
      this.misHabilidades = data;
      this.cdr.detectChanges();
    });
  }

  limpiarFormulario() {
    this.esEdicion = false;
    this.formHab = { nombre: '', porcentaje: '', icono_url: '' };
  }

  cargarDatosParaEditar(hab: any) {
    this.esEdicion = true;
    this.idEdicion = hab.id;
    this.formHab = { ...hab }; 
  }

  guardarCambios() {
    if (this.esEdicion && this.idEdicion) {
      this.habService.editarHabilidad(this.idEdicion, this.formHab).subscribe(() => this.cargarHabilidades());
    } else {
      this.habService.crearHabilidad(this.formHab).subscribe(() => this.cargarHabilidades());
    }
  }
  // ==========================================
// FUNCIÓN PARA ELIMINAR EXPERIENCIA
// ==========================================
borrarHabilidad(id: number) {
  // 1. Buena práctica: Pedimos confirmación antes de borrar
  if (confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
    
    // 2. Llamamos a la función que creaste en tu servicio
    // (Asegúrate de que 'this.expService' sea el nombre que le diste a tu servicio en el constructor)
    this.habService.borrarHabilidad(id).subscribe({
      next: (respuesta) => {
        alert('Habilidad eliminada correctamente.');
        
        // 3. Volvemos a cargar la lista para que el cambio se vea reflejado al instante
        this.cargarHabilidades(); 
      },
      error: (error) => {
        console.error('Error al borrar:', error);
        alert('Hubo un error al eliminar la Habilidad. Revisa que tu sesión siga iniciada.');
      }
    });
  }
}
}
