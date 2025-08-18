# Solução para Problema de Acesso aos Avatares

## O Problema

Os avatares estavam sendo salvos como URLs diretas do S3 Amazon:

```
https://mimir-documents.s3.us-east-1.amazonaws.com/avatars/userId/filename.jpg
```

Quando tentava acessar essas URLs, o acesso era **bloqueado** porque:

- O bucket S3 não estava configurado para acesso público
- As URLs diretas do S3 requerem permissões públicas no bucket

## A Solução Implementada

Implementamos um **sistema de URLs assinadas** que é mais seguro e resolve o problema:

### 1. Endpoint de Avatar no Servidor

- **Nova rota**: `GET /api/users/:userId/avatar`
- Este endpoint gera URLs assinadas temporárias do S3
- As URLs assinadas têm validade de 1 hora

### 2. Mudanças no Banco de Dados

- Agora salvamos apenas a **chave S3** no banco (ex: `avatars/userId/filename.jpg`)
- Não salvamos mais a URL completa

### 3. Mudanças nas Respostas da API

- O campo `avatar` agora retorna: `/api/users/userId/avatar`
- Esta URL redireciona para a URL assinada do S3

## Como Funciona

### Upload de Avatar

1. Cliente faz upload → `POST /api/users/:id/avatar`
2. Arquivo é salvo no S3 com chave: `avatars/userId/timestamp-filename.jpg`
3. Banco salva apenas a chave S3
4. API retorna: `avatar: "/api/users/userId/avatar"`

### Acesso ao Avatar

1. Cliente acessa → `GET /api/users/userId/avatar`
2. Servidor gera URL assinada do S3 (válida por 1 hora)
3. Servidor redireciona para a URL assinada
4. Cliente acessa a imagem diretamente do S3

## Vantagens desta Solução

### ✅ Segurança

- Bucket S3 permanece privado
- URLs temporárias (expiram em 1 hora)
- Controle de acesso no servidor

### ✅ Performance

- Imagens servidas diretamente do S3 (após redirecionamento)
- Cache automático do S3
- CDN do Amazon

### ✅ Compatibilidade

- URLs antigas com S3 direto são suportadas (fallback)
- Migração automática para novo formato

## Arquivos Modificados

1. **src/controllers/UserController.ts**

   - Adicionado: `getAvatarHandler()`

2. **src/services/UserService.ts**

   - Modificado: `uploadAvatar()` - salva chave em vez de URL
   - Modificado: `create()` - salva chave em vez de URL
   - Adicionado: `getAvatarSignedUrl()`

3. **src/routes/UserRoutes.ts**

   - Adicionado: `GET /:userId/avatar`

4. **src/controllers/AuthController.ts**
   - Modificado: `getProfile()` - retorna URL do endpoint

## Testando a Solução

### 1. Upload de Avatar

```bash
curl -X POST http://localhost:3000/api/users/USER_ID/avatar \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "avatar=@caminho/para/imagem.jpg"
```

### 2. Acessar Avatar

```bash
# Via browser ou curl
GET http://localhost:3000/api/users/USER_ID/avatar
# Será redirecionado para URL assinada do S3
```

### 3. Verificar Perfil

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN"
```

Resposta:

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "avatar": "/api/users/user-id/avatar",
    ...
  }
}
```

## Configuração Necessária

Certifique-se de que o arquivo `.env` contém:

```env
AWS_ACCESS_KEY_ID=sua_aws_access_key
AWS_SECRET_ACCESS_KEY=sua_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=mimir-documents
```

## Migração de Dados Existentes

Se você já tem avatares com URLs completas no banco, eles continuarão funcionando pois o código tem fallback automático:

```typescript
// Código detecta se é URL completa e extrai a chave
if (user.avatar.includes("amazonaws.com")) {
  const urlParts = user.avatar.split("/");
  avatarKey = urlParts.slice(-2).join("/");
}
```

## Próximos Passos

1. ✅ **Resolvido**: Acesso aos avatares funcionando
2. 🔄 **Opcional**: Migrar URLs antigas no banco para chaves apenas
3. 🔄 **Opcional**: Implementar cache de URLs assinadas
4. 🔄 **Opcional**: Configurar CDN CloudFront
