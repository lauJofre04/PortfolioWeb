import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProyectosServices } from '../../services/proyectos/proyectos-services';
import { AuthService } from '../../services/auth-service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos {
  misProyectos: any[] = [];
  estaLogueado: boolean = false;
  esAdmin: boolean = false;
  formProy: any = { nombre: '', tecnologias: '', link_repo: '', link_demo: '', descripcion: '', imagen_url: '' };
  esEdicion: boolean = false;
  idEdicion: number | null = null;
  showProjectModal: boolean = false;

  currentSlideIndex: number = 0;

  constructor(
    private proyService: ProyectosServices,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.cargarProyectos(this.themeService.getCurrentLang());

    this.themeService.language$.subscribe(lang => {
      this.cargarProyectos(lang);
    });

    this.authService.isLoggedIn$.subscribe(estado => {
      this.estaLogueado = estado;
      this.cdr.detectChanges();
    });

    this.authService.userRole$.subscribe(rol => {
      this.esAdmin = (rol === 'admin');
      this.cdr.detectChanges();
    });
  }

  cargarProyectos(lang: string = 'es') {
    this.proyService.getProyectos(lang).subscribe(data => {
      this.misProyectos = data;
      this.cdr.detectChanges();
    });
  }

  getVisibleSlides(): number {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  getPaginationDots(): number[] {
    const visibleSlides = this.getVisibleSlides();
    const totalDots = Math.ceil(this.misProyectos.length / visibleSlides);
    return Array.from({ length: totalDots }, (_, i) => i);
  }

  nextSlide(): void {
    const visibleSlides = this.getVisibleSlides();
    const maxIndex = Math.ceil(this.misProyectos.length / visibleSlides) - 1;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % (maxIndex + 1);
  }

  prevSlide(): void {
    const visibleSlides = this.getVisibleSlides();
    const maxIndex = Math.ceil(this.misProyectos.length / visibleSlides) - 1;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  limpiarFormulario() {
    this.esEdicion = false;
    this.formProy = { nombre: '', tecnologias: '', link_repo: '', link_demo: '', descripcion: '', imagen_url: '' };
    this.openProjectModal();
  }

  cargarDatosParaEditar(proy: any) {
    this.esEdicion = true;
    this.idEdicion = proy.id;
    this.formProy = { ...proy };
    this.openProjectModal();
  }

  guardarCambios() {
    if (this.esEdicion && this.idEdicion) {
      this.proyService.editarProyecto(this.idEdicion, this.formProy).subscribe(() => this.cargarProyectos());
    } else {
      this.proyService.crearProyecto(this.formProy).subscribe(() => this.cargarProyectos());
    }
    this.closeProjectModal();
  }

  openProjectModal() {
    this.showProjectModal = true;
  }

  closeProjectModal() {
    this.showProjectModal = false;
  }

  borrarProyecto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      this.proyService.borrarProyectos(id).subscribe({
        next: (respuesta) => {
          alert('Proyecto eliminado correctamente.');
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
