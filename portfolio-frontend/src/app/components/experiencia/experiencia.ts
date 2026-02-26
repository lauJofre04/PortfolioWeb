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
    // Nos suscribimos para escuchar al "megáfono"
    this.authService.isLoggedIn$.subscribe(estado => {
      this.estaLogueado = estado;
      this.cdr.detectChanges(); // Actualizamos la pantalla si el estado cambia
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
}