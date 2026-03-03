import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { Request, Response } from 'express';

const ORDER_STATUS_MAP: Record<string, string> = {
  payment_intent_succeeded: 'pago',
  payment_intent_payment_failed: 'pendente_pagamento',
  charge_refunded: 'pago', // mantém status, muda paymentStatus
};

const PAYMENT_STATUS_MAP: Record<string, string> = {
  payment_intent_succeeded: 'aprovado',
  payment_intent_payment_failed: 'recusado',
  charge_refunded: 'reembolsado',
};

/**
 * Webhook Stripe — atualiza automaticamente o status do pedido.
 * Configure a URL no Stripe Dashboard:
 *   https://<region>-<project-id>.cloudfunctions.net/stripeWebhook
 *
 * lembre de configurar:
 *   firebase functions:config:set stripe.webhook_secret="whsec_..."
 */
export const stripeWebhook = functions.https.onRequest(
  async (req: Request, res: Response) => {
    const webhookSecret = functions.config().stripe?.webhook_secret;
    if (!webhookSecret) {
      console.error('[stripeWebhook] webhook_secret não configurado.');
      res.status(500).send('Configuração ausente.');
      return;
    }

    const stripeSecretKey = functions.config().stripe?.secret;
    if (!stripeSecretKey) {
      res.status(500).send('Stripe não configurado.');
      return;
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' });

    let event: Stripe.Event;
    try {
      const sig = req.headers['stripe-signature'] as string;
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Assinatura inválida';
      console.error('[stripeWebhook] Assinatura inválida:', msg);
      res.status(400).send(`Webhook Error: ${msg}`);
      return;
    }

    const eventType = event.type;
    const paymentIntentId =
      (event.data.object as Stripe.PaymentIntent).id ?? null;

    if (!paymentIntentId) {
      res.json({ received: true });
      return;
    }

    // Buscar pedido pelo paymentId
    const db = admin.firestore();
    const snapshot = await db
      .collection('pedidos')
      .where('paymentId', '==', paymentIntentId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(`[stripeWebhook] Pedido com paymentId ${paymentIntentId} não encontrado.`);
      res.json({ received: true });
      return;
    }

    const orderRef = snapshot.docs[0].ref;
    const updates: Record<string, unknown> = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (ORDER_STATUS_MAP[eventType]) {
      updates.status = ORDER_STATUS_MAP[eventType];
    }
    if (PAYMENT_STATUS_MAP[eventType]) {
      updates.paymentStatus = PAYMENT_STATUS_MAP[eventType];
    }

    await orderRef.update(updates);
    console.log(`[stripeWebhook] Pedido ${orderRef.id} atualizado: ${eventType}`);

    res.json({ received: true });
  },
);
