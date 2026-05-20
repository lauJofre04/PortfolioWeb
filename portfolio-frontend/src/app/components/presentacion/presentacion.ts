import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PresentacionService } from '../../services/presentacion/presentacion-service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-presentacion',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './presentacion.html',
  styleUrl: './presentacion.css',
})
export class Presentacion implements OnInit {
  isFlipped: boolean = false;
  presentacionData: any = {
    titulo: 'Full Stack Developer Junior',
    nombre: 'Lautaro Jofre',
    descripcionCorta: 'Estudiante de Ingeniería en Sistemas y Desarrollador Web.',
    perfil: 'Desarrollador web Full Stack Jr. y estudiante de Ingeniería en Sistemas (tercer año). Interesado en Desarrollo Web (frontend y backend), con ganas de adquirir experiencia profesional y aprender nuevas herramientas en un entorno real de trabajo. Me destaco por ser resolutivo y trabajar bien en equipo.',
  };

  constructor(
    private presentacionService: PresentacionService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.cargarPresentacion(this.themeService.getCurrentLang());
    this.themeService.language$.subscribe(lang => {
      this.cargarPresentacion(lang);
    });
  }

  cargarPresentacion(lang: string = 'es'): void {
    this.presentacionService.getPresentacion(lang).subscribe(data => {
      this.presentacionData = {
        titulo: data.titulo || data.title || this.presentacionData.titulo,
        nombre: data.nombre || data.name || this.presentacionData.nombre,
        descripcionCorta: data.descripcion_corta || data.intro || data.descripcion || this.presentacionData.descripcionCorta,
        perfil: data.perfil || data.descripcion_larga || data.descripcion || this.presentacionData.perfil,
      };
    });
  }
}
