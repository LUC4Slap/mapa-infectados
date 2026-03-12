import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Infctado } from '../../interfaces/infectado.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-infectado',
  imports: [DatePipe],
  templateUrl: './card-infectado.html',
  styleUrl: './card-infectado.scss',
})
export class CardInfectado {
  @Input() infectado!: Infctado;
  @Output() focalizarInfectado = new EventEmitter<Infctado>();
  @Output() buscarProximos = new EventEmitter<Infctado>();

  focalizarInfectadoNoMapa() {
    this.focalizarInfectado.emit(this.infectado);
  }

  buscarInfectadosProximos(event: Event) {
    event.stopPropagation(); // Evitar que dispare o click do card
    this.buscarProximos.emit(this.infectado);
  }
}
