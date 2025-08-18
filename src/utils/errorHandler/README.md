# Sistema de Tratamento de Erros RFC7807

Sistema completo de tratamento de erros para o frontend, compatível com o padrão RFC7807 implementado na API.

## 📋 Características

- ✅ **Compatível com RFC7807** - Processa erros estruturados da API
- ✅ **Retry Automático** - Sistema inteligente de retry com backoff exponencial
- ✅ **Classificação Automática** - Categoriza erros por tipo e severidade
- ✅ **Múltiplas Formas de Exibição** - Toast, Modal, Inline, Form validation
- ✅ **Error Boundary** - Captura erros React automaticamente
- ✅ **Interceptors HTTP** - Integração transparente com Axios
- ✅ **TypeScript** - Totalmente tipado para melhor DX
- ✅ **Logging Estruturado** - Logs detalhados para debugging

## 🚀 Uso Rápido

### 1. Configuração Básica

```tsx
// app/layout.tsx
import { ErrorDisplay, PageErrorBoundary } from "@/components/ErrorBoundary";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PageErrorBoundary>
          {children}
          <ErrorDisplay />
        </PageErrorBoundary>
      </body>
    </html>
  );
}
```

### 2. Hook Principal

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { handleError, withRetry, isRetrying } = useErrorHandler({
    showToast: true,
    autoRetry: true,
  });

  const fetchData = async () => {
    try {
      return await withRetry(async () => {
        const response = await api.get("/data");
        return response.data;
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <button onClick={fetchData} disabled={isRetrying}>
      {isRetrying ? "Carregando..." : "Buscar Dados"}
    </button>
  );
}
```

### 3. Formulários com Validação

```tsx
import { useFormErrorHandler } from "@/hooks/useErrorHandler";
import { FormError } from "@/components/ErrorBoundary";

function LoginForm() {
  const { fieldErrors, generalError, processFormError, clearFormErrors } =
    useFormErrorHandler();

  const handleSubmit = async (data) => {
    clearFormErrors();

    try {
      await api.post("/auth/login", data);
    } catch (error) {
      processFormError(error, "loginForm");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <FormError errors={fieldErrors} fieldName="email" />

      <input name="password" />
      <FormError errors={fieldErrors} fieldName="password" />

      {generalError && <div className="error-message">{generalError}</div>}

      <button type="submit">Login</button>
    </form>
  );
}
```

### 4. Componentes Inline

```tsx
import { ErrorInline } from "@/components/ErrorBoundary";

function DataDisplay() {
  const [error, setError] = useState(null);

  return (
    <div>
      {error && (
        <ErrorInline
          error={error.error}
          result={error.result}
          variant="default"
          onClose={() => setError(null)}
          onAction={(action) => {
            if (action === "retry") {
              fetchData();
            }
          }}
        />
      )}

      {/* Seu conteúdo aqui */}
    </div>
  );
}
```

## 🎯 Tipos de Erro Suportados

### Categorias

- **validation** (400) - Dados de entrada inválidos
- **authentication** (401) - Falha na autenticação
- **authorization** (403) - Permissões insuficientes
- **not-found** (404) - Recurso não encontrado
- **conflict** (409) - Conflito de dados
- **business-rule** (422) - Regra de negócio violada
- **rate-limit** (429) - Limite de requisições
- **payment** (402) - Erros de pagamento
- **external-service** (502/503/504) - Falha em serviço externo
- **internal** (500) - Erro interno do servidor

### Códigos Principais

- `REQUIRED_FIELD`, `INVALID_FORMAT`, `INVALID_VALUE`
- `INVALID_CREDENTIALS`, `TOKEN_EXPIRED`, `LOGIN_REQUIRED`
- `INSUFFICIENT_PERMISSIONS`, `SUBSCRIPTION_REQUIRED`
- `USER_NOT_FOUND`, `APPOINTMENT_NOT_FOUND`
- `DUPLICATE_EMAIL`, `APPOINTMENT_CONFLICT`
- `PLAN_LIMIT_EXCEEDED`, `PAYMENT_FAILED`

## 🔧 Configuração Avançada

### Retry Personalizado

```tsx
import { errorHandler } from "@/utils/errorHandler";

// Configurar retry globalmente
errorHandler.configureRetry({
  maxAttempts: 5,
  baseDelay: 2000,
  maxDelay: 60000,
  backoffMultiplier: 2.5,
  retryableErrors: ["SERVICE_UNAVAILABLE", "TIMEOUT"],
  retryableStatuses: [429, 500, 502, 503, 504],
});
```

### Logger Customizado

```tsx
import { errorHandler } from "@/utils/errorHandler";

errorHandler.setLogger((level, message, error) => {
  // Integração com serviço de logging (Sentry, LogRocket, etc.)
  console[level](message, error);

  if (level === "error") {
    // Enviar para serviço de monitoramento
    sendToMonitoring(error);
  }
});
```

### Listeners de Erro

```tsx
import { errorHandler } from "@/utils/errorHandler";

// Adicionar listener global
const unsubscribe = errorHandler.addListener((error, result) => {
  // Analytics
  analytics.track("error_occurred", {
    category: error.category,
    code: error.code,
    action: result.action,
  });

  // Notificações push para erros críticos
  if (error.category === "payment") {
    showCriticalNotification(error);
  }
});

// Remover listener quando necessário
unsubscribe();
```

## 🎨 Componentes de Exibição

### ErrorToast

Toast não-intrusivo para erros gerais:

- Auto-dismiss configurável
- Ações inline (retry, redirect)
- Cores baseadas na categoria
- Progress bar visual

### ErrorModal

Modal para erros que precisam de atenção:

- Sugestões de resolução
- Ações customizadas
- Detalhes técnicos (dev)
- Links para documentação

### ErrorInline

Componente inline para contextos específicos:

- Variantes: default, compact, field
- Integração com formulários
- Ações contextuais

### ErrorBoundary

Captura erros React automaticamente:

- Fallback customizável
- Retry inteligente
- Logging estruturado
- Integração com Error Handler

## 🔍 Debugging

### Logs Estruturados

```javascript
// Console em desenvolvimento
[ErrorHandler] REQUIRED_FIELD: Campo obrigatório
{
  type: "https://api.clinica.com/errors/validation/required-field",
  code: "REQUIRED_FIELD",
  category: "validation",
  status: 400,
  requestId: "req_1704447600000_abc123",
  // ... mais detalhes
}
```

### Estado do Sistema

```tsx
import { errorHandler } from "@/utils/errorHandler";

// Estado atual
const state = errorHandler.getState();
console.log("Current error:", state.currentError);
console.log("Retry attempts:", state.retryAttempts);
console.log("Error history:", state.history);
```

## 🚨 Boas Práticas

### 1. **Sempre use o hook**

```tsx
// ✅ Bom
const { handleError } = useErrorHandler();

// ❌ Evitar uso direto
import { errorHandler } from "@/utils/errorHandler";
```

### 2. **Contexto específico**

```tsx
// ✅ Bom - contexto específico
handleError(error, {
  formId: "loginForm",
  showToast: false,
  onRetry: () => refetch(),
});
```

### 3. **Limpeza de estado**

```tsx
// ✅ Lembre-se de limpar erros
useEffect(() => {
  return () => {
    clearFormErrors();
  };
}, []);
```

### 4. **Error Boundary estratégico**

```tsx
// ✅ Bom - Error Boundary por página/seção
<PageErrorBoundary pageTitle="Dashboard">
  <DashboardContent />
</PageErrorBoundary>

// ❌ Evitar - Error Boundary muito granular
<ErrorBoundary>
  <Button />
</ErrorBoundary>
```

## 🔗 Integração com API

O sistema funciona automaticamente com qualquer API que retorne erros no formato RFC7807:

```json
{
  "type": "https://api.clinica.com/errors/validation/required-field",
  "title": "Campo obrigatório",
  "status": 400,
  "detail": "O campo email é obrigatório",
  "instance": "/api/users",
  "code": "REQUIRED_FIELD",
  "category": "validation",
  "requestId": "req_1704447600000_abc123",
  "timestamp": "2025-01-04T10:30:00Z",
  "errors": [
    {
      "field": "email",
      "code": "REQUIRED_FIELD",
      "message": "Email é obrigatório"
    }
  ]
}
```

## 📚 Referências

- [RFC 7807 - Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
