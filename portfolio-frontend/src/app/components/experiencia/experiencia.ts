import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ExperienciaService } from '../../services/experiencia/experiencia-services';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiencia.html',
  styleUrl: './experiencia.css'
})
export class Experiencia implements OnInit {
  miExperiencia: any[] = [];
  estaLogueado: boolean = false;
  esAdmin: boolean = false; 
  formExp: any = { 
  empresa: '', 
  puesto: '', 
  fecha_inicio: '', 
  fecha_fin: '', 
  descripcion: '', 
  logo_url: ''
} ;
  esEdicion: boolean = false;
  idEdicion: number | null = null;

  constructor(
    private expService: ExperienciaService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarExperiencia();

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

  cargarExperiencia() {
    this.expService.getExperiencia().subscribe(data => {
      this.miExperiencia = data;
      this.cdr.detectChanges();
    });
  }

  limpiarFormulario() {
    this.esEdicion = false;
    this.formExp = { empresa: '', puesto: '', fecha_inicio: '', fecha_fin: '', descripcion: '', logo_url: '' };

  }

  cargarDatosParaEditar(exp: any) {
  this.esEdicion = true;
  this.idEdicion = exp.id;
  this.formExp = { ...exp }; 
  
  // Acomodamos ambas fechas para que el input type="date" las lea bien
  if(this.formExp.fecha_inicio) this.formExp.fecha_inicio = this.formExp.fecha_inicio.split('T')[0];
  if(this.formExp.fecha_fin) this.formExp.fecha_fin = this.formExp.fecha_fin.split('T')[0];
}

  guardarCambios() {
    if (this.esEdicion && this.idEdicion) {
      this.expService.editarExperiencia(this.idEdicion, this.formExp).subscribe(() => {
        this.cargarExperiencia();
      });
    } else {
      this.expService.crearExperiencia(this.formExp).subscribe(() => {
        this.cargarExperiencia();
      });
    }
  }
  // ==========================================
// FUNCIÓN PARA ELIMINAR EXPERIENCIA
// ==========================================
borrarExperiencia(id: number) {
  // 1. Buena práctica: Pedimos confirmación antes de borrar
  if (confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
    
    // 2. Llamamos a la función que creaste en tu servicio
    // (Asegúrate de que 'this.expService' sea el nombre que le diste a tu servicio en el constructor)
    this.expService.borrarExperiencia(id).subscribe({
      next: (respuesta) => {
        alert('Experiencia eliminada correctamente.');
        
        // 3. Volvemos a cargar la lista para que el cambio se vea reflejado al instante
        this.cargarExperiencia(); 
      },
      error: (error) => {
        console.error('Error al borrar:', error);
        alert('Hubo un error al eliminar la experiencia. Revisa que tu sesión siga iniciada.');
      }
    });
  }
}
}