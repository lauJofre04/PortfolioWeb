import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProyectosServices } from '../../services/proyectos/proyectos-services';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-proyectos',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos {
  misProyectos: any[] = [];
  estaLogueado: boolean = false;
  esAdmin: boolean = false; 
  formProy: any = { nombre: '', tecnologias: '', link_repo: '', link_demo: '', descripcion: '' };
  esEdicion: boolean = false;
  idEdicion: number | null = null;

  constructor(
    private proyService: ProyectosServices,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ){}

  

  ngOnInit(): void {
    this.cargarProyectos();

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

  cargarProyectos() {
    this.proyService.getProyectos().subscribe(data => {
      this.misProyectos = data;
      this.cdr.detectChanges();
    });
  }

  limpiarFormulario() {
    this.esEdicion = false;
    this.formProy = { nombre: '', tecnologias: '', link_repo: '', link_demo: '', descripcion: '' };
  }

  cargarDatosParaEditar(proy: any) {
    this.esEdicion = true;
    this.idEdicion = proy.id;
    this.formProy = { ...proy }; 
  }

  guardarCambios() {
    if (this.esEdicion && this.idEdicion) {
      this.proyService.editarProyecto(this.idEdicion, this.formProy).subscribe(() => this.cargarProyectos());
    } else {
      this.proyService.crearProyecto(this.formProy).subscribe(() => this.cargarProyectos());
    }
  }
  // ==========================================
// FUNCIÓN PARA ELIMINAR EXPERIENCIA
// ==========================================
borrarProyecto(id: number) {
  // 1. Buena práctica: Pedimos confirmación antes de borrar
  if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
    
    // 2. Llamamos a la función que creaste en tu servicio
    // (Asegúrate de que 'this.expService' sea el nombre que le diste a tu servicio en el constructor)
    this.proyService.borrarProyectos(id).subscribe({
      next: (respuesta) => {
        alert('Proyecto eliminado correctamente.');
        
        // 3. Volvemos a cargar la lista para que el cambio se vea reflejado al instante
        this.cargarProyectos(); 
      },
      error: (error) => {
        console.error('Error al borrar:', error);
        alert('Hubo un error al eliminar el proyecto. Revisa que tu sesión siga iniciada.');
      }
    });
  }
}
}
