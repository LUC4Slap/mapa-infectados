import { Component, inject, OnInit, signal, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Infectados } from '../../services/infectados';
import { Infctado } from '../../interfaces/infectado.interface';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../environments/environment';
import { CardInfectado } from '../../components/card-infectado/card-infectado';
import { ModalCadastroInfectado } from '../../components/modal-cadastro-infectado/modal-cadastro-infectado';

@Component({
  selector: 'app-home',
  imports: [CommonModule, GoogleMapsModule, CardInfectado, ModalCadastroInfectado],
  providers: [Infectados],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {
  private infectadoService = inject(Infectados);
  infectados = signal<Infctado[]>([]);
  sidebarAberta = signal<boolean>(true);
  mapaCarregado = signal<boolean>(false);
  isBrowser = signal<boolean>(false);
  distanciaMaxima = signal<number>(5); // Distância em km
  
  // Google Maps configurações - inicializadas sem referências ao google
  center: any = { lat: -15.7939, lng: -47.8828 };
  zoom = 5; // Zoom inicial mais próximo
  mapOptions: any = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 3,
    styles: [],
    gestureHandling: 'greedy' // Melhor experiência de zoom
  };
  
  markerOptions: any = {
    draggable: false
  };
  
  markers: Array<{
    position: any;
    options: any;
    infectado: Infctado;
    cluster?: Infctado[]; // Para marcadores de cluster
  }> = [];
  
  selectedInfectado: Infctado | null = null;
  private map?: any;
  private currentZoom = 5;
  private zoomThreshold = 15; // Zoom abaixo desse valor usa clusters (ajustado para 15)
  private zoomTimeout: any = null; // Para debounce do zoom
  private isAdjustingBounds = false; // Flag para evitar loop de zoom
  private shouldFitBounds = true; // Controla quando fazer fitBounds
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(): void {
    // Verificar se está no browser
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    
    // Carregar Google Maps API
    if (this.isBrowser()) {
      this.loadGoogleMapsScript();
    }
    this.buscarInfectados();
  }

  async ngAfterViewInit(): Promise<void> {
    // Aguardar carregamento da API apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      await this.waitForGoogleMaps();
    }
  }

  private loadGoogleMapsScript(): void {
    if (typeof google !== 'undefined') {
      this.mapaCarregado.set(true);
      return;
    }

    if (typeof document === 'undefined') return; // Proteção SSR

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.mapaCarregado.set(true);
    };
    script.onerror = () => {
      console.error('Erro ao carregar Google Maps API. Verifique sua chave API.');
    };
    document.head.appendChild(script);
  }

  private async waitForGoogleMaps(): Promise<void> {
    // Garantir que estamos no browser
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }
    
    return new Promise((resolve) => {
      const checkGoogle = setInterval(() => {
        if (typeof google !== 'undefined') {
          clearInterval(checkGoogle);
          resolve();
        }
      }, 100);
      
      // Timeout de segurança após 10 segundos
      setTimeout(() => {
        clearInterval(checkGoogle);
        resolve();
      }, 10000);
    });
  }

  onMapReady(map: any): void {
    this.map = map;
    this.currentZoom = map.getZoom();
    
    // Listener para mudança de zoom
    if (typeof google !== 'undefined') {
      google.maps.event.addListener(map, 'zoom_changed', () => {
        // Ignorar mudanças de zoom durante ajuste automático
        if (this.isAdjustingBounds) {
          return;
        }
        
        const newZoom = map.getZoom();
        
        // Limpar timeout anterior
        if (this.zoomTimeout) {
          clearTimeout(this.zoomTimeout);
        }
        
        // Atualizar currentZoom e binding de zoom imediatamente
        this.currentZoom = newZoom;
        this.zoom = newZoom;
        
        // Debounce muito curto para reagrupamento automático rápido
        this.zoomTimeout = setTimeout(() => {
          this.adicionarMarcadores();
        }, 50); // Reduzido para 50ms - reagrupamento quase instantâneo
      });
    }
    
    // Adicionar marcadores se já tivermos dados
    if (this.infectados().length > 0) {
      this.adicionarMarcadores();
    }
  }

  toggleSidebar(): void {
    this.sidebarAberta.update(aberta => !aberta);
  }

  contarPorSexo(sexo: string): number {
    return this.infectados().filter(i => i.sexo === sexo).length;
  }

  focalizarInfectado(infectado: Infctado): void {
    if (!this.map || typeof google === 'undefined') {
      console.warn('Mapa ainda não está pronto');
      return;
    }
    
    this.shouldFitBounds = false;
    
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.sidebarAberta.set(false);
    }

    const targetZoom = Math.max(this.zoomThreshold + 2, 17);
    
    this.zoom = targetZoom;
    this.currentZoom = targetZoom;
    this.center = { 
      lat: infectado.latitude, 
      lng: infectado.longitude 
    };
    
    this.map.setZoom(targetZoom);
    this.map.setCenter({ lat: infectado.latitude, lng: infectado.longitude });
    
    setTimeout(() => {
      this.selectedInfectado = infectado;
      this.adicionarMarcadores();
    }, 400);
  }

  buscarInfectados(): void {
    this.infectadoService.buscarInfectados().subscribe((data: Infctado[]) => {
      // console.log(data);
      this.infectados.set(data);
      this.shouldFitBounds = true; // Permitir fitBounds após buscar
      if (this.map) {
        this.adicionarMarcadores();
      }
    });
  }

  adicionarMarcadores(): void {
    if (typeof google === 'undefined') return;
    
    const infectados = this.infectados();
    
    if (infectados.length === 0) {
      this.markers = [];
      return;
    }

    // Decidir se usa cluster ou marcadores individuais baseado no zoom
    const useCluster = this.currentZoom < this.zoomThreshold;
    
    console.log(`🔍 Zoom ${this.currentZoom}: ${useCluster ? 'CLUSTERS (reagrupamento automático)' : 'MARCADORES INDIVIDUAIS'}`);
    
    if (useCluster) {
      this.criarMarcadoresClustered(infectados);
    } else {
      this.criarMarcadoresIndividuais(infectados);
    }
  }

  private criarMarcadoresClustered(infectados: Infctado[]): void {
    let gridSize: number;
    
    if (this.currentZoom <= 3) {
      gridSize = 10.0;  // Zoom 1-3: País inteiro
    } else if (this.currentZoom <= 4) {
      gridSize = 7.0;   // Zoom 4: Múltiplas regiões
    } else if (this.currentZoom <= 5) {
      gridSize = 5.0;   // Zoom 5: Região ampla
    } else if (this.currentZoom <= 6) {
      gridSize = 3.0;   // Zoom 6: Estados
    } else if (this.currentZoom <= 7) {
      gridSize = 2.0;   // Zoom 7: Estado/Região
    } else if (this.currentZoom <= 8) {
      gridSize = 1.2;   // Zoom 8: Área metropolitana
    } else if (this.currentZoom <= 9) {
      gridSize = 0.8;   // Zoom 9: Cidade grande
    } else if (this.currentZoom <= 10) {
      gridSize = 0.5;   // Zoom 10: Cidade
    } else if (this.currentZoom <= 11) {
      gridSize = 0.3;   // Zoom 11: Área da cidade
    } else if (this.currentZoom <= 12) {
      gridSize = 0.15;  // Zoom 12: Bairros grandes
    } else if (this.currentZoom <= 13) {
      gridSize = 0.08;  // Zoom 13: Bairros
    } else if (this.currentZoom <= 14) {
      gridSize = 0.03;  // Zoom 14: Ruas próximas
    } else {
      gridSize = 0.01;  // Zoom 15: Quarteirões (antes de virar individual)
    }
    
    const clustersMap = new Map<string, Infctado[]>();
    
    infectados.forEach(infectado => {
      const gridLat = Math.floor(infectado.latitude / gridSize);
      const gridLng = Math.floor(infectado.longitude / gridSize);
      const key = `${gridLat}_${gridLng}`;
      
      if (!clustersMap.has(key)) {
        clustersMap.set(key, []);
      }
      clustersMap.get(key)!.push(infectado);
    });
    // Criar marcadores de cluster
    this.markers = [];
    clustersMap.forEach((grupo, key) => {
      // Calcular centro do cluster
      const centerLat = grupo.reduce((sum, i) => sum + i.latitude, 0) / grupo.length;
      const centerLng = grupo.reduce((sum, i) => sum + i.longitude, 0) / grupo.length;
      
      const count = grupo.length;
      const masculinoCount = grupo.filter(i => i.sexo === 'Masculino').length;
      const femininoCount = grupo.filter(i => i.sexo === 'Feminino').length;
      
      // Criar marcador de cluster
      this.markers.push({
        position: { lat: centerLat, lng: centerLng },
        options: {
          icon: this.criarIconeCluster(count, masculinoCount, femininoCount),
          title: `${count} infectado${count > 1 ? 's' : ''} (${masculinoCount}♂ / ${femininoCount}♀)`
        },
        infectado: grupo[0], // Primeiro infectado do grupo para referência
        cluster: grupo // Guardar todos os infectados do cluster
      });
    });
  }

  private criarIconeCluster(total: number, masculino: number, feminino: number): any {
    // Definir tamanho baseado na quantidade
    let size = 50;
    let fontSize = '16';
    if (total > 10) {
      size = 60;
      fontSize = '18';
    }
    if (total > 50) {
      size = 70;
      fontSize = '20';
    }
    
    // Cor baseada na predominância
    let color = '#9c27b0'; // Roxo se misturado
    if (masculino === 0) color = '#ff6b9d'; // Rosa se só feminino
    if (feminino === 0) color = '#4a90e2'; // Azul se só masculino
    
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="white" stroke-width="3"/>
        <text x="${size/2}" y="${size/2 + 6}" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">${total}</text>
      </svg>
    `;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size/2)
    };
  }

  private criarMarcadoresIndividuais(infectados: Infctado[]): void {
    const coordenadasMap = new Map<string, Infctado[]>();
    const precisao = this.currentZoom >= 16 ? 5 : 4; 
    
    infectados.forEach(infectado => {
      const key = `${infectado.latitude.toFixed(precisao)}_${infectado.longitude.toFixed(precisao)}`;
      if (!coordenadasMap.has(key)) {
        coordenadasMap.set(key, []);
      }
      coordenadasMap.get(key)!.push(infectado);
    });

    this.markers = infectados.map((infectado, index) => {
      const key = `${infectado.latitude.toFixed(precisao)}_${infectado.longitude.toFixed(precisao)}`;
      const grupoNoMesmoLocal = coordenadasMap.get(key) || [];
      const indexNoGrupo = grupoNoMesmoLocal.findIndex(i => i.id === infectado.id);
      
      let lat = infectado.latitude;
      let lng = infectado.longitude;
      
      if (grupoNoMesmoLocal.length > 1) {
        let offsetDistance: number;
        
        if (this.currentZoom < 16) {
          offsetDistance = 0.005; // ~500 metros - bem separados
        } else if (this.currentZoom < 18) {
          offsetDistance = 0.002; // ~200 metros - próximos mas separados
        } else {
          offsetDistance = 0.0008; // ~80 metros - muito próximos
        }
        
        const angle = (indexNoGrupo / grupoNoMesmoLocal.length) * 2 * Math.PI;
        lat += Math.cos(angle) * offsetDistance;
        lng += Math.sin(angle) * offsetDistance;
      }
      
      return {
        position: {
          lat: lat,
          lng: lng
        },
        options: {
          ...this.markerOptions,
          icon: {
            url: infectado.sexo === 'Masculino' 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#4a90e2" stroke="white" stroke-width="2"/>
                    <text x="20" y="28" font-size="20" font-weight="bold" fill="white" text-anchor="middle">♂</text>
                  </svg>
                `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#ff6b9d" stroke="white" stroke-width="2"/>
                    <text x="20" y="28" font-size="20" font-weight="bold" fill="white" text-anchor="middle">♀</text>
                  </svg>
                `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          },
          title: `Infectado - ${infectado.sexo}`
        },
        infectado
      };
    });

    if (this.map && infectados.length > 0 && this.shouldFitBounds) {
      this.isAdjustingBounds = true;
      
      const bounds = new google.maps.LatLngBounds();
      infectados.forEach(i => {
        bounds.extend({ lat: i.latitude, lng: i.longitude });
      });
      
      this.map.fitBounds(bounds, {
        padding: { top: 50, right: 50, bottom: 50, left: 450 } 
      });
      
      setTimeout(() => {
        const currentMapZoom = this.map.getZoom();
        if (currentMapZoom < 5) {
          this.map.setZoom(5);
          this.currentZoom = 5;
        }
        if (infectados.length === 1 && currentMapZoom < 13) {
          this.map.setZoom(13);
          this.currentZoom = 13;
        }
        
        // Resetar flags após ajuste
        this.isAdjustingBounds = false;
        this.shouldFitBounds = false;
      }, 100);
    }
  }

  onMarkerClick(marker: any): void {
    this.shouldFitBounds = false;
    if (marker.cluster && marker.cluster.length > 1) {
      this.selectedInfectado = null;
      this.center = marker.position;
    } else {
      this.selectedInfectado = marker.infectado;
      this.center = marker.position;
    }
  }

  closeInfoWindow(): void {
    this.selectedInfectado = null;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  // Abrir modal de cadastro
  abrirModalCadastro(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const modalEl = document.getElementById('modalCadastroInfectado');
    if (modalEl && typeof (window as any).bootstrap !== 'undefined') {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    } else {
      console.error('Modal element or Bootstrap not found');
    }
  }

  filtarPorSexo(sexo: string): void {
    this.infectadoService.buscarInfectadoPorSexo(sexo).subscribe((data: Infctado[]) => {
      this.infectados.set(data);
      this.shouldFitBounds = true; // Permitir fitBounds após filtrar
      // Atualizar marcadores no mapa
      if (this.map) {
        this.adicionarMarcadores();
      }
    });
  }

  resetarFiltro(): void {
    this.buscarInfectados();
  }

  buscarInfectadosProximos(infectado: Infctado): void {
    const distanciaEmMetros = this.distanciaMaxima() * 1000; // Converter km para metros
    this.infectadoService.buscarProximos(infectado.latitude, infectado.longitude, distanciaEmMetros).subscribe(
      (data: Infctado[]) => {
        this.infectados.set(data);
        this.shouldFitBounds = true; // Permitir fitBounds após buscar
        
        // Atualizar marcadores no mapa
        if (this.map) {
          this.adicionarMarcadores();
        }
        
        // Centralizar no infectado selecionado
        this.center = { 
          lat: infectado.latitude, 
          lng: infectado.longitude 
        };
        
        // Ajustar zoom baseado na distância
        // 1-5km: zoom 13, 5-20km: zoom 11, 20-50km: zoom 9, 50-200km: zoom 7, 200km+: zoom 5
        const dist = this.distanciaMaxima();
        if (dist <= 5) {
          this.zoom = 13;
        } else if (dist <= 20) {
          this.zoom = 11;
        } else if (dist <= 50) {
          this.zoom = 9;
        } else if (dist <= 200) {
          this.zoom = 7;
        } else {
          this.zoom = 5;
        }
        this.currentZoom = this.zoom;
      },
      (error) => {
        console.error('Erro ao buscar infectados próximos:', error);
      }
    );
  }

  atualizarDistancia(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.distanciaMaxima.set(Number(input.value));
  }

}
