import { Component, inject, signal, PLATFORM_ID, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Infectados } from '../../services/infectados';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-cadastro-infectado',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-cadastro-infectado.html',
  styleUrl: './modal-cadastro-infectado.scss',
})
export class ModalCadastroInfectado {
  private infectadoService = inject(Infectados);
  private platformId = inject(PLATFORM_ID);
  
  // Output para notificar quando um novo infectado for cadastrado
  infectadoCadastrado = output<void>();
  
  // Form fields - usando writable signals
  dataNascimento = signal<string>('');
  sexo = signal<string>('');
  latitude = signal<number>(0);
  longitude = signal<number>(0);

  // Estado do componente
  salvando = signal<boolean>(false);
  obtendoLocalizacao = signal<boolean>(false);
  mensagemErro = signal<string>('');
  mensagemSucesso = signal<string>('');

  // Data máxima para o campo de data (hoje)
  get dataMaxima(): string {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  }

  // Validação do formulário
  formularioValido(): boolean {
    return !!(
      this.dataNascimento() &&
      this.sexo() &&
      this.latitude() !== 0 &&
      this.longitude() !== 0
    );
  }

  // Obter localização atual do usuário
  obterLocalizacaoAtual(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!navigator.geolocation) {
      this.mensagemErro.set('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    this.obtendoLocalizacao.set(true);
    this.mensagemErro.set('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude.set(Number(position.coords.latitude.toFixed(6)));
        this.longitude.set(Number(position.coords.longitude.toFixed(6)));
        this.obtendoLocalizacao.set(false);
        this.mensagemSucesso.set('Localização obtida com sucesso!');
        
        setTimeout(() => {
          this.mensagemSucesso.set('');
        }, 3000);
      },
      (error) => {
        this.obtendoLocalizacao.set(false);
        
        let mensagem = 'Erro ao obter localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensagem = 'Permissão para acessar localização foi negada';
            break;
          case error.POSITION_UNAVAILABLE:
            mensagem = 'Informações de localização não disponíveis';
            break;
          case error.TIMEOUT:
            mensagem = 'Tempo limite para obter localização excedido';
            break;
        }
        
        this.mensagemErro.set(mensagem);
      }
    );
  }

  // Cadastrar infectado
  cadastrarInfectado(): void {
    if (!this.formularioValido()) {
      this.mensagemErro.set('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.salvando.set(true);
    this.mensagemErro.set('');
    this.mensagemSucesso.set('');

    const novoInfectado = {
      dataNascimento: this.dataNascimento(),
      sexo: this.sexo(),
      latitude: this.latitude(),
      longitude: this.longitude()
    };

    this.infectadoService.cadastrarInfectado(novoInfectado).subscribe({
      next: (response) => {
        if(response.status !== 200) {
          this.salvando.set(false);
          this.mensagemErro.set(response.message || 'Erro ao cadastrar infectado. Tente novamente.');
          return;
        }
        console.log('Infectado cadastrado com sucesso:', response);
        this.salvando.set(false);
        this.mensagemSucesso.set('Infectado cadastrado com sucesso!');
        
        // Emitir evento para o componente pai
        this.infectadoCadastrado.emit();
        
        // Limpar formulário após 2 segundos e fechar modal
        setTimeout(() => {
          this.limparFormulario();
          this.fecharModal();
        }, 2000);
      },
      error: (error) => {
        console.error('Erro ao cadastrar infectado:', error);
        this.salvando.set(false);
        this.mensagemErro.set(
          error.error?.message || 
          'Erro ao cadastrar infectado. Tente novamente.'
        );
      }
    });
  }

  // Limpar formulário
  limparFormulario(): void {
    this.dataNascimento.set('');
    this.sexo.set('');
    this.latitude.set(0);
    this.longitude.set(0);
    this.mensagemErro.set('');
    this.mensagemSucesso.set('');
  }

  // Fechar modal
  fecharModal(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const modalElement = document.getElementById('modalCadastroInfectado');
    if (modalElement && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}
