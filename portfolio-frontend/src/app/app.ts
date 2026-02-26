import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Presentacion } from './components/presentacion/presentacion';
import { Estudios } from './components/estudios/estudios';
import { Experiencia } from './components/experiencia/experiencia';
import { Habilidades } from './components/habilidades/habilidades';
import { Proyectos } from './components/proyectos/proyectos';
import { Footer } from './components/footer/footer';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [CommonModule,Header,Presentacion,Estudios,Experiencia,Habilidades,Proyectos, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio-frontend');
}
