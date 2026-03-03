# Backend — Firebase Cloud Functions

Cloud Functions do AppMeuSabor responsáveis por:
- Criar pedidos com validação no servidor
- Processar pagamentos (Stripe e MercadoPago)
- Receber webhooks automáticos de confirmação de pagamento

## Pré-requisitos

- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- Projeto Firebase configurado: `firebase login && firebase use <project-id>`
- Node.js 20+

## Instalação

```bash
cd backend/functions
npm install
```

## Configurar variáveis de ambiente (chaves secretas)

```bash
# Stripe
firebase functions:config:set \
  stripe.secret="sk_live_SUA_CHAVE_SECRETA" \
  stripe.webhook_secret="whsec_SEU_WEBHOOK_SECRET"

# MercadoPago
firebase functions:config:set \
  mercadopago.token="APP_USR-SEU_ACCESS_TOKEN"
```

> ⚠️ **NUNCA** commite as chaves acima. Use sempre `firebase functions:config:set`.

## Deploy

```bash
# Build TypeScript primeiro
npm run build

# Deploy de todas as functions
firebase deploy --only functions

# Ou deploy individual
firebase deploy --only functions:processPayment
```

## Testar localmente com Emulator

```bash
npm run serve
# Functions rodarão em http://localhost:5001
```

## Configurar Webhooks nos painéis dos gateways

### Stripe Dashboard
1. Acesse: https://dashboard.stripe.com/webhooks
2. Adicione o endpoint:
   `https://<REGION>-<PROJECT_ID>.cloudfunctions.net/stripeWebhook`
3. Eventos a escutar: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copie o **Signing secret** e configure: `firebase functions:config:set stripe.webhook_secret="whsec_..."`

### MercadoPago
1. Acesse: https://www.mercadopago.com.br/developers/panel/app/webhooks
2. URL de notificação:
   `https://<REGION>-<PROJECT_ID>.cloudfunctions.net/mercadopagoWebhook`
3. Eventos: `payment`

## Estrutura das functions

| Function | Tipo | Descrição |
|---|---|---|
| `createOrder` | Callable | Cria pedido com validação |
| `processPayment` | Callable | Inicia cobrança no gateway |
| `stripeWebhook` | HTTP | Recebe confirmações do Stripe |
| `mercadopagoWebhook` | HTTP | Recebe notificações do MercadoPago |
