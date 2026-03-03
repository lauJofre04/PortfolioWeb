import { Component } from '@angular/core';

@Component({
  selector: 'app-presentacion',
  imports: [],
  templateUrl: './presentacion.html',
  styleUrl: './presentacion.css',
})
export class Presentacion {
  // Agrega esta variable para controlar el giro de la tarjeta
  isFlipped: boolean = false;
}
