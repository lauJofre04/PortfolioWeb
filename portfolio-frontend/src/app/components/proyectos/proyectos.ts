import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
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
      if (this.currentSlideIndex >= this.misProyectos.length) {
        this.currentSlideIndex = 0;
      }
      this.cdr.detectChanges();
    });
  }

  // Tecnologías como lista limpia: sin espacios ni elementos vacíos (p. ej. una coma al final)
  techList(proy: any): string[] {
    return String(proy?.tecnologias || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
  }

  nextSlide(): void {
    if (!this.misProyectos.length) return;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.misProyectos.length;
  }

  prevSlide(): void {
    if (!this.misProyectos.length) return;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.misProyectos.length) % this.misProyectos.length;
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showProjectModal) {
      this.closeProjectModal();
      this.cdr.detectChanges();
    }
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
