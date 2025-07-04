# Documentação Técnica - Mimir API

Este documento fornece uma visão técnica completa da API Mimir, projetada para ser consumida por uma IA ou desenvolvedor front-end para criar a camada de serviço (ex: Axios) e os tipos (TypeScript) correspondentes.

## 1. Visão Geral do Projeto

- **Propósito**: API para um sistema de agendamento de consultas psicológicas e psiquiátricas.
- **Stack**: Node.js, Express.js, TypeScript.
- **ORM**: Prisma com banco de dados PostgreSQL.
- **Autenticação**: JWT (JSON Web Tokens).

## 2. Arquitetura e Conceitos Chave

- **Padrão Service/Controller**: A lógica é separada em:
  - **Controllers**: Responsáveis por receber as requisições HTTP, validar os dados de entrada e enviar as respostas.
  - **Services**: Contêm a lógica de negócio principal, interagem com o banco de dados (via Prisma) e realizam as operações.
- **DTOs (Data Transfer Objects)**: A comunicação entre camadas (e com o cliente) é fortemente tipada usando interfaces definidas em `src/types`. Isso garante consistência e clareza nos dados esperados e retornados.
- **Usuário Guest vs. Autenticado**:
  - **Guest**: Pode realizar ações limitadas, como criar uma reserva temporária (`TimeSlotReservation`), sem precisar de login.
  - **Autenticado**: Possui um `token` e pode realizar todas as ações, como confirmar reservas, ver seu histórico e gerenciar dados.
- **Reserva (`TimeSlotReservation`) vs. Agendamento (`Appointment`)**:
  - **Reserva**: É um bloqueio _temporário_ de um horário. Expira após um tempo determinado (ex: 15 minutos). Não é uma consulta garantida.
  - **Agendamento**: É a consulta _confirmada_ e permanente no sistema, criada a partir de uma reserva válida. Está associada a um pagamento.

## 3. Autenticação

- **Método**: JWT Bearer Token.
- **Fluxo**:
  1. O cliente envia `email` e `password` para o endpoint `POST /api/auth/login`.
  2. A API valida as credenciais e retorna um `token` JWT.
  3. Para todos os endpoints protegidos, o cliente deve enviar o token no header `Authorization`.
- **Exemplo de Header**: `Authorization: Bearer <seu_token_aqui>`
- **Middleware**: O `authMiddleware` intercepta as requisições para validar o token e anexa os dados do usuário (`req.user`) ao objeto da requisição.

## 4. Estrutura de Resposta de Erro

Respostas de erro (status `4xx` ou `5xx`) seguem um formato padrão para facilitar o tratamento no front-end:

```json
{
  "error": "CODIGO_DO_ERRO_EM_MAIUSCULAS",
  "message": "Descrição amigável do erro."
}
```

## 5. Estrutura de Diretórios (`src`)

```
/src
├── /config/         # Configurações (ex: JWT)
├── /controllers/    # Lógica de requisição/resposta HTTP
├── /database/       # Configuração do cliente Prisma
├── /middlewares/    # Middlewares (ex: autenticação)
├── /routes/         # Definição dos endpoints da API
├── /scripts/        # Scripts utilitários (ex: migrações)
├── /services/       # Lógica de negócio principal
├── /types/          # Interfaces e tipos (DTOs)
└── /utils/          # Funções utilitárias
```

## 6. Modelos de Dados (Prisma Schema)

Os principais modelos de dados são:

- **`User`**: Armazena dados de pacientes, profissionais e administradores.
- **`Address`**: Endereços associados a um usuário. Um usuário pode ter vários.
- **`Psychologist` / `Psychiatrist`**: Perfis profissionais vinculados a um `User`.
- **`AvailableTimes`**: Define a grade de horários de trabalho de um profissional.
- **`TimeSlotReservation`**: Uma reserva de horário temporária, feita por um guest ou usuário logado.
- **`Appointment`**: Uma consulta confirmada, com status, dados de pagamento e vinculada a um paciente e profissional.
- **`Payment`**: Registro de um pagamento no gateway (Asaas), vinculado a um `Appointment`.

## 7. Documentação dos Endpoints (API Reference)

A URL base para todos os endpoints é `/api`.

---

### 7.1. Auth

Endpoints para autenticação.

#### `POST /auth/login`

- **Descrição**: Autentica um usuário e retorna um token JWT.
- **Autenticação**: Nenhuma.
- **Request Body**: `{ "email": "string", "password": "string" }`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": { "id": "uuid", "name": "string", "email": "string", ... },
    "token": "jwt_token_string"
  }
  ```

---

### 7.2. Addresses

CRUD para gerenciamento de endereços de usuários.

#### `POST /addresses`

- **Descrição**: Cria um novo endereço para um usuário.
- **Autenticação**: Requerida.
- **Request Body**: `CreateAddressDTO` (ver seção de Tipos).
- **Success Response (201 CREATED)**: `{ "success": true, "data": Address, "message": "string" }`

#### `GET /addresses/user/:userId`

- **Descrição**: Lista todos os endereços de um usuário específico.
- **Autenticação**: Requerida.
- **Success Response (200 OK)**: `{ "success": true, "data": Address[] }`

---

### 7.3. Time Slots & Reservations

Endpoints para verificar disponibilidade e gerenciar reservas.

#### `GET /time-slots/availability`

- **Descrição**: Verifica se um horário específico está disponível.
- **Autenticação**: Nenhuma.
- **Query Params**: `medicalId`, `date` (YYYY-MM-DD), `timeSlot` (HH:mm:ss).
- **Success Response (200 OK)**: `{ "available": boolean, "reason"?: "string" }`

#### `POST /time-slots/reserve` (Usuário Logado)

- **Descrição**: Cria uma ou múltiplas reservas para um usuário autenticado.
- **Autenticação**: Requerida.
- **Request Body (Single)**: `{ "medicalId": "uuid", "patientId": "uuid", "reservationDate": "string", "reservationTime": "string" }`
- **Request Body (Multiple)**: `{ "patientId": "uuid", "reservations": [{ "medicalId": "uuid", "reservationDate": "string", "reservationTime": "string" }, ...] }`
- **Success Response (201 CREATED)**: Retorna os dados da(s) reserva(s) criada(s) com um tempo de expiração.

#### `POST /time-slots/reserve-guest` (Guest)

- **Descrição**: Cria uma ou múltiplas reservas para um usuário não logado (guest).
- **Autenticação**: Nenhuma.
- **Request Body (Single/Multiple)**: Similar ao anterior, mas sem `patientId`.
- **Success Response (201 CREATED)**: Retorna os dados da(s) reserva(s) e o campo `"requiresAuth": true`.

#### `POST /time-slots/link-multiple`

- **Descrição**: Vincula múltiplas reservas "guest" a um usuário que acabou de se autenticar.
- **Autenticação**: Requerida.
- **Request Body**: `{ "reservationIds": ["uuid", "uuid", ...], "patientId": "uuid" }`
- **Success Response (200 OK)**: Retorna um balanço das reservas vinculadas e falhas.

#### `POST /time-slots/confirm-multiple`

- **Descrição**: Confirma múltiplas reservas, transformando-as em `Appointments`.
- **Autenticação**: Requerida.
- **Request Body**: `{ "reservationIds": ["uuid", ...], "appointmentData": { "notes": "string", "status": "SCHEDULED" } }`
- **Success Response (200 OK)**: Retorna os `Appointments` criados e um balanço das falhas.

---

### 7.4. Appointments

Gerenciamento de consultas confirmadas.

#### `POST /appointments/guest`

- **Descrição**: Agendamento direto para um usuário guest, sem reserva prévia. Cria o usuário guest e o agendamento em uma única etapa.
- **Autenticação**: Nenhuma.
- **Request Body**: Contém dados do profissional, do paciente (nome, email), do agendamento e `guestUserData` com detalhes do endereço.
- **Success Response (201 CREATED)**: `{ "success": true, "data": Appointment, "isGuestUser": true }`

---

### 7.5. Payments

Endpoints para processar pagamentos.

#### `POST /payments` (Usuário Logado)

- **Descrição**: Cria um pagamento para um `Appointment` de um usuário logado.
- **Autenticação**: Requerida.
- **Request Body**: `{ "appointmentId": "uuid", "billingType": "PIX" | "CREDIT_CARD" | "BOLETO", ... }`
- **Success Response (201 CREATED)**: Retorna os links e dados do pagamento do gateway (Asaas).

#### `POST /payments/guest`

- **Descrição**: Cria um pagamento para um `Appointment` de um usuário guest.
- **Autenticação**: Nenhuma.
- **Request Body**: `{ "appointmentId": "uuid", "billingType": "string", ... }`
- **Success Response (201 CREATED)**: Retorna os links e dados do pagamento.

## 8. Principais Tipos e DTOs (Data Transfer Objects)

Abaixo estão as interfaces mais importantes para a comunicação com a API.

```typescript
// src/types/Address.ts
export interface CreateAddressDTO {
  userId: string;
  title: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country?: string;
  isDefault?: boolean;
}

// src/types/TimeSlotReservation.ts
export interface SingleReservation {
  medicalId: string;
  reservationDate: string;
  reservationTime: string;
}

export interface CreateMultipleReservationsDTO {
  patientId: string;
  reservations: SingleReservation[];
  durationMinutes?: number;
  packageId?: string;
}

export interface CreateMultipleGuestReservationsDTO {
  reservations: SingleReservation[];
  durationMinutes?: number;
  packageId?: string;
}

export interface LinkMultipleReservationsToUserDTO {
  reservationIds: string[];
  patientId: string;
}

export interface ConfirmMultipleReservationsDTO {
  reservationIds: string[];
  appointmentData?: any;
}

// src/types/Appointment.ts
export interface CreateAppointmentWithGuestDTO {
  medicalId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  amount: number;
  guestUserData: {
    document?: string;
    phone?: string;
    whatsappPhone?: string;
    zipCode?: string;
    street?: string;
    number?: number;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

// src/types/User.ts
export interface CreateUserDTO {
  email: string;
  password?: string;
  name: string;
  phone: string;
  level?: number;
  status?: number;
  document?: string;
}
```
