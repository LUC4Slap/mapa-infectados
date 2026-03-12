# 🦠 Consumo API Mongo - Mapa de Infectados

Aplicação Angular para visualização de infectados em um mapa interativo usando **Google Maps**.

## 🎯 Funcionalidades

- 🗺️ **Mapa interativo** com Google Maps
- 📍 **Marcadores customizados** diferenciados por sexo (♂ Masculino / ♀ Feminino)
- 📊 **Painel lateral** com estatísticas e lista de infectados
- 🎨 **Interface moderna** com animações suaves
- 📱 **Design responsivo** para mobile e desktop
- 🔍 **Focalização individual** ao clicar em um infectado

## ⚙️ Pré-requisitos

- Node.js 18+ 
- Angular CLI 21+
- **Chave da API do Google Maps** (veja instruções abaixo)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd consumo-api-mongo
```

2. Instale as dependências:
```bash
npm install
```

3. **Configure a chave da API do Google Maps:**
   - Leia o arquivo [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) para instruções detalhadas
   - Edite `src/environments/environment.ts` e substitua `SUA_CHAVE_API_GOOGLE_MAPS_AQUI` pela sua chave

4. Execute o projeto:
```bash
npm start
```

5. Acesse `http://localhost:4200/`

## 🗺️ Configuração do Google Maps

Para obter sua chave da API do Google Maps gratuitamente, siga as instruções detalhadas no arquivo:

📄 **[GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md)**

### Resumo rápido:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto
3. Ative a **Maps JavaScript API**
4. Crie uma chave de API
5. Configure em `src/environments/environment.ts`

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   └── cadastrar-infectado/    # Componente de cadastro
│   ├── interfaces/
│   │   └── infectado.interface.ts  # Interface do infectado
│   ├── pages/
│   │   └── home/                   # Página principal com mapa
│   └── services/
│       └── infectados.ts           # Service para API
└── environments/
    ├── environment.ts              # Configurações (chave API aqui)
    └── environment.development.ts  # Configurações de dev
```

## 🛠️ Tecnologias

- **Angular 21** - Framework
- **Google Maps API** - Mapas interativos
- **@angular/google-maps** - Integração oficial do Google Maps
- **Bootstrap 5** - Framework CSS para UI
- **RxJS** - Programação reativa
- **SCSS** - Estilização
- **TypeScript** - Linguagem

## 📚 Documentação Adicional

- [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) - Guia de configuração do Google Maps
- [BOOTSTRAP_USAGE.md](BOOTSTRAP_USAGE.md) - Guia de uso do Bootstrap 5
- [BOOTSTRAP_EXAMPLE.html](BOOTSTRAP_EXAMPLE.html) - Exemplos práticos de componentes

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
