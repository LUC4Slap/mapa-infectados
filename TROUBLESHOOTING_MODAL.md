# 🔧 Troubleshooting - Modal não Abre

## ✅ Alterações Já Realizadas

1. **CommonModule adicionado** ao componente Home
2. **Modal renderizado apenas no browser** (proteção SSR com `@if (isBrowser())`)
3. **Z-index configurado** para modal e backdrop aparecerem acima do mapa
4. **Bootstrap JS incluído** no angular.json

## 🐛 Possíveis Causas e Soluções

### 1. Bootstrap JS não está carregando

**Verificar no Console do Browser:**
```javascript
// Abra o DevTools (F12) e no Console digite:
typeof bootstrap
// Deve retornar: "object"
```

**Solução se retornar "undefined":**
- Pare o servidor (`Ctrl+C`)
- Limpe o cache: `ng cache clean`
- Reinstale dependências: `npm install`
- Inicie novamente: `npm start`

### 2. Conflito com SSR

**Sintoma:** Modal funciona após reload da página, mas não na primeira navegação.

**Solução:** Já implementada! O modal agora só renderiza no browser com `@if (isBrowser())`

### 3. Verificar se o modal está no DOM

**No DevTools:**
1. Abra a aba **Elements/Inspetor**
2. Pressione `Ctrl+F` (ou `Cmd+F` no Mac)
3. Busque por: `modalCadastroInfectado`
4. Verifique se o elemento existe

**Se NÃO existir:**
- O componente `<app-modal-cadastro-infectado />` pode não estar sendo renderizado
- Verifique se `isBrowser()` está retornando `true` no console:

```typescript
// No componente Home, adicione temporariamente no ngOnInit:
console.log('isBrowser:', this.isBrowser());
```

### 4. Testar manualmente no Console

**Abrir modal via JavaScript:**
```javascript
// No console do DevTools:
const modal = new bootstrap.Modal(document.getElementById('modalCadastroInfectado'));
modal.show();
```

**Se isso funcionar:** O problema está no botão ou nos atributos `data-bs-*`

**Se NÃO funcionar:** O Bootstrap não está carregado ou o modal não está no DOM

### 5. Verificar atributos do botão

**O botão deve ter EXATAMENTE:**
```html
<button 
  class="btn btn-primary" 
  data-bs-toggle="modal" 
  data-bs-target="#modalCadastroInfectado">
```

**⚠️ Atenção:**
- `data-bs-target` deve ter o `#` antes do ID
- O ID no modal deve ser: `id="modalCadastroInfectado"` (sem `#`)
- Não pode haver espaços ou caracteres extras

### 6. Verificar ordem de carregamento

**Se o botão renderiza ANTES do Bootstrap carregar:**

Adicione um listener no componente Home:

```typescript
ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Garantir que Bootstrap está carregado
    const checkBootstrap = setInterval(() => {
      if (typeof (window as any).bootstrap !== 'undefined') {
        console.log('✅ Bootstrap carregado!');
        clearInterval(checkBootstrap);
      }
    }, 100);
  }
}
```

### 7. Alternativa: Abrir modal via código

Se os atributos `data-bs-*` não funcionarem, use código TypeScript:

**No home.ts, adicione:**
```typescript
abrirModalCadastro(): void {
  if (!isPlatformBrowser(this.platformId)) return;
  
  const modalEl = document.getElementById('modalCadastroInfectado');
  if (modalEl && typeof (window as any).bootstrap !== 'undefined') {
    const modal = new (window as any).bootstrap.Modal(modalEl);
    modal.show();
  }
}
```

**No home.html, altere o botão:**
```html
<button 
  class="btn btn-primary" 
  (click)="abrirModalCadastro()">
  <i class="bi bi-plus-circle"></i> Cadastrar Novo
</button>
```

### 8. Cache do navegador

**Limpe completamente:**
1. No Chrome: `Ctrl+Shift+Delete` (ou `Cmd+Shift+Delete`)
2. Marque "Imagens e arquivos em cache"
3. Limpe e recarregue com `Ctrl+Shift+R` (ou `Cmd+Shift+R`)

### 9. Verificar erros no Console

**Procure por:**
- ❌ Erros em vermelho (especialmente relacionados a Bootstrap)
- ⚠️ Avisos sobre módulos não carregados
- 🔴 Erros de CORS ou 404 em scripts

## 🧪 Teste Rápido

Execute esta sequência no **Console do DevTools** quando a página estiver carregada:

```javascript
// 1. Verificar Bootstrap
console.log('Bootstrap:', typeof bootstrap);

// 2. Verificar modal no DOM
console.log('Modal existe:', !!document.getElementById('modalCadastroInfectado'));

// 3. Tentar abrir modal
if (typeof bootstrap !== 'undefined') {
  const modalEl = document.getElementById('modalCadastroInfectado');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    console.log('✅ Modal aberto!');
  } else {
    console.log('❌ Modal não encontrado no DOM');
  }
} else {
  console.log('❌ Bootstrap não está carregado');
}
```

## 📞 Próximos Passos

1. **Execute o teste rápido** acima no console
2. **Compartilhe o resultado** de cada `console.log`
3. **Verifique se há erros** na aba Console do DevTools
4. **Tire um print** da estrutura HTML procurando por `modalCadastroInfectado`

Com essas informações, podemos diagnosticar exatamente o que está impedindo o modal de abrir!

## 🎯 Solução Mais Provável

**Se você está usando SSR (Server-Side Rendering)**, que é o caso deste projeto, o problema mais comum é que o Bootstrap tenta inicializar antes de estar no browser. 

**Solução já implementada:** O modal agora só renderiza com `@if (isBrowser())` e está **fora** do contexto do mapa.

**Teste:** Abra o DevTools, vá em Elements, e busque por `app-modal-cadastro-infectado`. Ele deve aparecer no final do HTML, **fora** do `<div class="map-fullscreen">`.
