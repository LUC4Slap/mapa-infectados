# 🗺️ Configuração do Google Maps API

Este projeto utiliza o **Google Maps** para visualizar os infectados no mapa interativo.

## 📝 Como obter sua chave da API do Google Maps

### Passo 1: Criar um projeto no Google Cloud
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Clique em **"Selecionar um projeto"** no topo da página
4. Clique em **"Novo Projeto"**
5. Dê um nome ao projeto (ex: "Mapa Infectados")
6. Clique em **"Criar"**

### Passo 2: Ativar a Maps JavaScript API
1. No menu lateral, vá em **"APIs e Serviços"** > **"Biblioteca"**
2. Procure por **"Maps JavaScript API"**
3. Clique na API e depois em **"Ativar"**

### Passo 3: Criar uma chave API
1. No menu lateral, vá em **"APIs e Serviços"** > **"Credenciais"**
2. Clique em **"+ Criar Credenciais"** no topo
3. Selecione **"Chave de API"**
4. Sua chave será criada e exibida
5. **Copie a chave** (será algo como: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Passo 4: (Opcional mas Recomendado) Restringir a chave
1. Após criar a chave, clique em **"Editar chave de API"**
2. Em **"Restrições de aplicativo"**, selecione:
   - **"Referenciadores HTTP (sites)"** para desenvolvimento
   - Adicione `http://localhost:*` para desenvolvimento local
   - Adicione seu domínio de produção quando implantar
3. Em **"Restrições de API"**, selecione:
   - **"Restringir chave"**
   - Marque apenas **"Maps JavaScript API"**
4. Clique em **"Salvar"**

### Passo 5: Configurar no projeto
1. Abra o arquivo `src/environments/environment.ts`
2. Substitua `SUA_CHAVE_API_GOOGLE_MAPS_AQUI` pela sua chave:

```typescript
export const environment = {
  production: false,
  googleMapsApiKey: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' // Sua chave aqui
};
```

3. Faça o mesmo no arquivo `src/environments/environment.development.ts`

### Passo 6: Ativar Billing (Remove "For development purposes only")
1. No Google Cloud Console, vá em **"Faturamento"**
2. Clique em **"Vincular uma conta de faturamento"**
3. Adicione um cartão de crédito (você não será cobrado se ficar no limite gratuito)
4. Isso remove automaticamente o watermark "For development purposes only"

**Importante:** Mesmo ativando o billing, você continua com **$200/mês grátis**, suficiente para:
- 28.500 visualizações de mapa por mês
- Desenvolvimento e testes sem custos

## ⚠️ Importante

- **NÃO COMMITE** suas chaves de API no repositório público
- Os arquivos `src/environments/environment*.ts` devem estar no `.gitignore`
- Use variáveis de ambiente em produção

## 💰 Custos

O Google Maps oferece **$200 de crédito gratuito por mês**, suficiente para:
- **28.500 visualizações de mapa** por mês (carregamento do mapa)
- Uso básico em desenvolvimento geralmente não ultrapassa o limite gratuito

## 🔗 Links Úteis

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentação Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Preços do Google Maps](https://mapsplatform.google.com/pricing/)
- [Boas práticas de segurança](https://developers.google.com/maps/api-security-best-practices)

## 🚀 Executando o Projeto

Após configurar a chave da API:

```bash
npm install
npm start
```

O aplicativo estará disponível em `http://localhost:4200`

## ❓ Problemas Comuns

### "For development purposes only" aparece no mapa

**Causa:** A chave da API não tem billing ativado ou está mal configurada.

**Solução:**
1. **Ative o Billing** no Google Cloud Console (ainda é grátis até $200/mês)
2. Configure restrições corretas na chave API
3. A mensagem desaparecerá automaticamente

**Alternativa temporária:** Um CSS foi adicionado ao projeto para ocultar visualmente a mensagem durante o desenvolvimento. Mas configure o billing para uma solução definitiva.

### Mapa não carrega

1. Verifique se a chave da API está correta em `src/environments/environment.ts`
2. Confirme que a **Maps JavaScript API** está ativada no Google Cloud Console
3. Verifique o console do navegador para mensagens de erro
