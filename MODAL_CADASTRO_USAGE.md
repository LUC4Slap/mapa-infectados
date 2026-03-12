# 🦠 Modal de Cadastro de Infectado - Guia de Uso

## 📋 Visão Geral

O modal de cadastro permite registrar novos infectados com:
- Data de nascimento
- Sexo (Masculino/Feminino)
- Coordenadas GPS (Latitude/Longitude)
- Geolocalização automática do navegador

## 🚀 Como Usar

### 1. Importar o Componente

Adicione o componente na página onde deseja exibir o modal (ex: `home.ts`):

```typescript
import { ModalCadastroInfectado } from '../../components/modal-cadastro-infectado/modal-cadastro-infectado';

@Component({
  selector: 'app-home',
  imports: [
    // ... outros imports
    ModalCadastroInfectado
  ],
  // ...
})
```

### 2. Adicionar o Modal no Template

No template da página (ex: `home.html`), adicione o componente:

```html
<!-- Pode colocar no final do arquivo -->
<app-modal-cadastro-infectado />
```

### 3. Criar Botão para Abrir o Modal

Adicione um botão com o atributo `data-bs-toggle` e `data-bs-target`:

```html
<!-- Exemplo de botão simples -->
<button 
  type="button" 
  class="btn btn-danger" 
  data-bs-toggle="modal" 
  data-bs-target="#modalCadastroInfectado">
  <i class="bi bi-plus-circle"></i> Cadastrar Infectado
</button>

<!-- Exemplo de botão flutuante (FAB) -->
<button 
  type="button" 
  class="btn btn-danger btn-floating" 
  data-bs-toggle="modal" 
  data-bs-target="#modalCadastroInfectado"
  style="position: fixed; bottom: 20px; right: 20px; border-radius: 50%; width: 60px; height: 60px; z-index: 1000;">
  <i class="bi bi-plus-lg fs-4"></i>
</button>
```

## 🎨 Recursos do Modal

### ✅ Funcionalidades Implementadas

1. **Validação de Formulário**
   - Todos os campos são obrigatórios
   - Data máxima: hoje
   - Latitude: -90 a 90
   - Longitude: -180 a 180

2. **Geolocalização Automática**
   - Botão "Usar Minha Localização Atual"
   - Solicita permissão do navegador
   - Preenche automaticamente lat/lng

3. **Feedback Visual**
   - Alertas de sucesso (verde)
   - Alertas de erro (vermelho)
   - Spinners durante carregamento
   - Botões desabilitados durante salvamento

4. **Design Responsivo**
   - Funciona em desktop, tablet e mobile
   - Radio buttons visuais para sexo
   - Ícones Bootstrap Icons

### 🎯 Exemplo de Implementação Completa na Home

**home.ts:**
```typescript
import { ModalCadastroInfectado } from '../../components/modal-cadastro-infectado/modal-cadastro-infectado';

@Component({
  selector: 'app-home',
  imports: [
    GoogleMapsModule,
    ModalCadastroInfectado // Adicione aqui
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // ... código existente
}
```

**home.html (adicione no final):**
```html
<!-- Botão Flutuante -->
<button 
  type="button" 
  class="btn-cadastrar-infectado" 
  data-bs-toggle="modal" 
  data-bs-target="#modalCadastroInfectado"
  title="Cadastrar Novo Infectado">
  <i class="bi bi-plus-lg"></i>
</button>

<!-- Modal -->
<app-modal-cadastro-infectado />
```

**home.scss (estilo do botão flutuante):**
```scss
.btn-cadastrar-infectado {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 20px rgba(220, 53, 69, 0.4);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 6px 30px rgba(220, 53, 69, 0.6);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }
}
```

## 📡 Integração com API

O modal utiliza o serviço `Infectados` que deve ter o método:

```typescript
cadastrarInfectado(dados: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/infectados`, dados);
}
```

### Dados Enviados para API

```json
{
  "dataNascimento": "1990-05-15",
  "sexo": "Masculino",
  "latitude": -23.550520,
  "longitude": -46.633308
}
```

## 🔧 Personalização

### Alterar Cores

No arquivo `modal-cadastro-infectado.scss`:

```scss
// Mudar cor principal do modal
.modal-header {
  background-color: #sua-cor !important;
}

// Mudar cor do botão
.btn-danger {
  background: linear-gradient(135deg, #sua-cor1 0%, #sua-cor2 100%);
}
```

### Adicionar Campos Extras

1. Adicione o signal no TypeScript:
```typescript
novoCampo = signal<string>('');
```

2. Adicione o campo no formulário HTML:
```html
<div class="mb-3">
  <label for="novoCampo" class="form-label fw-bold">Novo Campo</label>
  <input 
    type="text" 
    class="form-control"
    [(ngModel)]="novoCampo"
    name="novoCampo">
</div>
```

3. Inclua no objeto de cadastro:
```typescript
const novoInfectado = {
  // ... campos existentes
  novoCampo: this.novoCampo()
};
```

## 🐛 Troubleshooting

### Modal não abre
- Verifique se o Bootstrap JS está carregado no `angular.json`
- Confirme que o ID do modal é `modalCadastroInfectado`
- Veja o console do navegador para erros

### Geolocalização não funciona
- Verifique se o navegador suporta geolocalização
- Confirme que o usuário deu permissão de localização
- Use HTTPS (geolocalização não funciona em HTTP)

### Erro ao salvar
- Verifique se a API está rodando
- Confirme a URL da API no serviço `Infectados`
- Veja o Network tab do DevTools para detalhes

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (últimas versões)
- ✅ iOS Safari, Chrome Mobile
- ✅ Android Chrome, Firefox
- ⚠️ Geolocalização requer HTTPS (exceto localhost)

## 🎉 Pronto!

Seu modal de cadastro está configurado e pronto para uso. Ao cadastrar um infectado com sucesso, o formulário é limpo automaticamente e o modal fecha após 2 segundos.
