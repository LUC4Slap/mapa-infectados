import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Infctado } from '../interfaces/infectado.interface';
import { CadastroInfectado } from '../interfaces/cadastro-infectado.interface';
import { ResponseCadastro } from '../interfaces/response-cadastro.interface';

@Injectable({
  providedIn: 'root',
})
export class Infectados {
  private http = inject(HttpClient);
  private BASE_URL = 'http://localhost:5238/api'

  buscarInfectados(): Observable<Infctado[]> {
    return this.http.get<Infctado[]>(`${this.BASE_URL}/Infectado`);
  }

  cadastrarInfectado(infectado: CadastroInfectado): Observable<ResponseCadastro> {
    return this.http.post<ResponseCadastro>(`${this.BASE_URL}/Infectado`, infectado);
  }

  buscarInfectadoPorSexo(sexo: string): Observable<Infctado[]> {
    //http://localhost:5238/api/Infectado/filtro-sexo/{sexo}
    return this.http.get<Infctado[]>(`${this.BASE_URL}/Infectado/filtro-sexo/${sexo}`);
  }

  buscarProximos(latitude: number, longitude: number, distanciaMaxima: number): Observable<Infctado[]> {
    return this.http.get<Infctado[]>(`${this.BASE_URL}/Infectado/proximos?latitude=${latitude}&longitude=${longitude}&distanciaMaxima=${distanciaMaxima}`);
  }

}
