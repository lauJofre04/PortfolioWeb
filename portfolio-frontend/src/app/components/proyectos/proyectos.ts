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
  formProy: any = { nombre: '', tecnologias: '', link_repo: '', link_demo: '', descripcion: '' };
  esEdicion: boolean = false;
  idEdicion: number | null = null;

  constructor(
    private proyService: ProyectosServices,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ){}

  ngOnInit(){
    this.cargarProyectos();
    // Nos suscribimos para escuchar al "megáfono"
    this.authService.isLoggedIn$.subscribe(estado => {
      this.estaLogueado = estado;
      this.cdr.detectChanges(); // Actualizamos la pantalla si el estado cambia
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
}
