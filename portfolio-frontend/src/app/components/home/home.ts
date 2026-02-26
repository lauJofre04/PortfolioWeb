import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Presentacion } from "../presentacion/presentacion";
import { Estudios } from "../estudios/estudios";
import { Experiencia } from "../experiencia/experiencia";
import { Habilidades } from "../habilidades/habilidades";
import { Footer } from "../footer/footer";
import { Proyectos } from "../proyectos/proyectos";

@Component({
  selector: 'app-home',
  imports: [Header, Presentacion, Estudios, Experiencia, Habilidades, Footer, Proyectos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
