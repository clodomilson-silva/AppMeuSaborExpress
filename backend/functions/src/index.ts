/**
 * AppMeuSabor — Firebase Cloud Functions
 * Inicializa o Firebase Admin e exporta todas as functions.
 */

import * as admin from 'firebase-admin';

// Inicializar o Admin SDK uma única vez
admin.initializeApp();

// ─── Exportações ──────────────────────────────────────────────────────────────
export { createOrder } from './createOrder';
export { processPayment } from './processPayment';
export { stripeWebhook } from './webhookStripe';
export { mercadopagoWebhook } from './webhookMercadoPago';
