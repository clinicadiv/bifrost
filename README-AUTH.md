# Sistema de Autenticação e Rotas Protegidas

Este projeto implementa um sistema completo de autenticação com rotas protegidas e públicas usando **modal de login**.

## Como Funciona

### Rotas Públicas

- `/register` - Página de registro (exemplo)
- `/forgot-password` - Recuperação de senha (se implementado)
- `/reset-password` - Reset de senha (se implementado)

### Rotas Protegidas

Todas as outras rotas requerem autenticação:

- `/` - Dashboard principal
- `/consultas` - Consultas
- `/nova-consulta` - Nova consulta
- `/psico-plus` - Psico+
- E todas as outras páginas do app

## Componentes Principais

### 1. `useAuthStore` (hooks/useAuthStore.ts)

Store do Zustand que gerencia o estado de autenticação:

- `user` - Dados do usuário logado
- `isLoading` - Estado de carregamento
- `token` - Token de autenticação
- `isLoginModalOpen` - Estado do modal de login
- `handleLogin()` - Função para fazer login
- `logout()` - Função para logout
- `checkAuth()` - Verifica se o usuário está autenticado
- `openLoginModal()` - Abre o modal de login
- `closeLoginModal()` - Fecha o modal de login

### 2. `DefaultLayout` (layouts/DefaultLayout.tsx)

Layout principal que automaticamente:

- Verifica autenticação na inicialização
- Abre o modal de login quando necessário
- Redireciona usuários autenticados que tentam acessar páginas públicas
- Renderiza o layout correto baseado no estado de autenticação

### 3. `Login` (components/Login.tsx)

Modal de login que:

- Aparece automaticamente quando o usuário não está autenticado
- Permite login via email/senha
- Fecha automaticamente após login bem-sucedido

### 4. Configuração de Rotas (utils/routes.ts)

- `PUBLIC_ROUTES` - Array com as rotas públicas
- `isPublicRoute()` - Função para verificar se uma rota é pública

## Como Adicionar Novas Páginas

### Página Pública

1. Adicione a rota no array `PUBLIC_ROUTES` em `utils/routes.ts`
2. Crie a página normalmente em `src/app/`
3. A página será automaticamente tratada como pública

### Página Protegida

1. Crie a página normalmente em `src/app/`
2. Não precisa fazer mais nada - será automaticamente protegida

## Exemplo de Uso

### Página Protegida (Automático)

```tsx
// src/app/minha-pagina/page.tsx
export default function MinhaPagina() {
  return (
    <div>
      <h1>Esta página é automaticamente protegida</h1>
    </div>
  );
}
```

### Página Pública

```tsx
// 1. Adicione em utils/routes.ts
export const PUBLIC_ROUTES = [
  "/register",
  "/minha-pagina-publica", // <- Adicione aqui
];

// 2. Crie a página
// src/app/minha-pagina-publica/page.tsx
export default function MinhaPaginaPublica() {
  return (
    <div>
      <h1>Esta página é pública</h1>
    </div>
  );
}
```

## Funcionalidades

✅ **Proteção automática de rotas**
✅ **Modal de login automático**
✅ **Redirecionamento inteligente**
✅ **Loading states**
✅ **Persistência de sessão com cookies**
✅ **Verificação de token automática**

## Fluxo de Autenticação

1. **Usuário acessa uma rota protegida sem estar logado**
   → Abre modal de login automaticamente

2. **Usuário faz login com sucesso**
   → Modal fecha e usuário permanece na página

3. **Usuário já logado tenta acessar página pública**
   → Redireciona para `/` (dashboard)

4. **Usuário recarrega a página**
   → Verifica token automaticamente
   → Mantém sessão ou abre modal se expirado

## Como Customizar

### Alterar rotas padrão

Edite as constantes em `utils/routes.ts`:

```typescript
export const DEFAULT_LOGIN_REDIRECT = "/"; // Para onde redirecionar após login
export const DEFAULT_AUTHENTICATED_REDIRECT = "/"; // Para onde redirecionar usuários logados
```

### Adicionar mais rotas públicas

```typescript
export const PUBLIC_ROUTES = [
  "/register",
  "/about", // Nova rota pública
  "/contact", // Outra rota pública
];
```

### Abrir modal de login manualmente

```tsx
import { useAuthStore } from "@/hooks";

function MeuComponente() {
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  return <button onClick={openLoginModal}>Fazer Login</button>;
}
```
