import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- OBLIGATORIO PARA LOS INPUTS
import { EstudiosService } from '../../services/estudios/estudiosService'; // <--- Tu nuevo servicio
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-estudios',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- Agregalo aquí
  templateUrl: './estudios.html',
  styleUrl: './estudios.css'
})
export class Estudios implements OnInit {
  misEstudios: any[] = [];
  estaLogueado: boolean = false;
  esAdmin: boolean = false; 
  // Objeto para manejar el formulario del modal
  formEstudio: any = {
    titulo: '',
    institucion: '',
    descripcion: '',
    fecha_inicio: ''
  };
  
  esEdicion: boolean = false; // Bandera para saber si editamos o creamos
  idEdicion: number | null = null; // Guardamos el ID si estamos editando
  
  constructor(
    private estudios: EstudiosService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  this.cargarEstudios();

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

  cargarEstudios() {
    this.estudios.getEstudios().subscribe(data => {
      this.misEstudios = data;
      this.cdr.detectChanges();
    });
  }

  // Se ejecuta al dar click en "+ Agregar"
  limpiarFormulario() {
    this.esEdicion = false;
    this.formEstudio = { titulo: '', institucion: '', descripcion: '', fecha_inicio: '' };
  }

  // Se ejecuta al dar click en "Editar" (el lapicito)
  cargarDatosParaEditar(estudio: any) {
    this.esEdicion = true;
    this.idEdicion = estudio.id;
    // Copiamos los datos al formulario
    this.formEstudio = { ...estudio }; 
    
    // Pequeño truco para que el input date lea la fecha de MySQL
    if(this.formEstudio.fecha_inicio) {
       this.formEstudio.fecha_inicio = this.formEstudio.fecha_inicio.split('T')[0];
    }
  }

  // Se ejecuta al dar click en el botón azul del Modal
  guardarCambios() {
    if (this.esEdicion && this.idEdicion) {
      // EDITAR
      this.estudios.editarEstudio(this.idEdicion, this.formEstudio).subscribe(() => {
        this.cargarEstudios(); // Recargamos la lista
        alert('Estudio actualizado correctamente');
      });
    } else {
      // CREAR
      this.estudios.crearEstudio(this.formEstudio).subscribe(() => {
        this.cargarEstudios(); // Recargamos la lista
        alert('Estudio creado correctamente');
      });
    }
  }
  // ==========================================
// FUNCIÓN PARA ELIMINAR EXPERIENCIA
// ==========================================
borrarEstudios(id: number) {
  // 1. Buena práctica: Pedimos confirmación antes de borrar
  if (confirm('¿Estás seguro de que quieres eliminar este estudio?')) {
    
    // 2. Llamamos a la función que creaste en tu servicio
    // (Asegúrate de que 'this.expService' sea el nombre que le diste a tu servicio en el constructor)
    this.estudios.borrarEstudio(id).subscribe({
      next: (respuesta) => {
        alert('Estudio eliminada correctamente.');
        
        // 3. Volvemos a cargar la lista para que el cambio se vea reflejado al instante
        this.cargarEstudios(); 
      },
      error: (error) => {
        console.error('Error al borrar:', error);
        alert('Hubo un error al eliminar el Estudio. Revisa que tu sesión siga iniciada.');
      }
    });
  }
}
}