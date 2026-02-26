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

  constructor(
    private habService: HabilidadesServices,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ){}


  ngOnInit(){
    this.cargarHabilidades();
    // Nos suscribimos para escuchar al "megáfono"
    this.authService.isLoggedIn$.subscribe(estado => {
      this.estaLogueado = estado;
      this.cdr.detectChanges(); // Actualizamos la pantalla si el estado cambia
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
}
