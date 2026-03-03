import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Request, Response } from 'express';

const MP_PAYMENT_STATUS_MAP: Record<string, { orderStatus: string; paymentStatus: string }> = {
  approved: { orderStatus: 'pago', paymentStatus: 'aprovado' },
  rejected: { orderStatus: 'pendente_pagamento', paymentStatus: 'recusado' },
  cancelled: { orderStatus: 'cancelado', paymentStatus: 'recusado' },
  refunded: { orderStatus: 'pago', paymentStatus: 'reembolsado' },
  pending: { orderStatus: 'pendente_pagamento', paymentStatus: 'pendente' },
  in_process: { orderStatus: 'pendente_pagamento', paymentStatus: 'pendente' },
};

/**
 * Webhook MercadoPago — atualiza automaticamente o status do pedido.
 * Configure a URL IPN no painel do MercadoPago:
 *   https://<region>-<project-id>.cloudfunctions.net/mercadopagoWebhook
 *
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications
 */
export const mercadopagoWebhook = functions.https.onRequest(
  async (req: Request, res: Response) => {
    const accessToken = functions.config().mercadopago?.token;
    if (!accessToken) {
      res.status(500).send('MercadoPago não configurado.');
      return;
    }

    // O MercadoPago envia notificações com o tipo 'payment' e o ID do pagamento
    const { type, data } = req.body;

    if (type !== 'payment' || !data?.id) {
      res.json({ received: true });
      return;
    }

    const paymentId = String(data.id);

    try {
      // Buscar detalhes do pagamento na API do MercadoPago
      const client = new MercadoPagoConfig({ accessToken });
      const paymentApi = new Payment(client);
      const paymentData = await paymentApi.get({ id: paymentId });

      const status = paymentData.status ?? 'pending';
      const externalReference = paymentData.external_reference; // orderId

      if (!externalReference) {
        console.warn(`[mpWebhook] external_reference ausente para payment ${paymentId}`);
        res.json({ received: true });
        return;
      }

      const db = admin.firestore();
      const orderRef = db.collection('pedidos').doc(externalReference);
      const orderSnap = await orderRef.get();

      if (!orderSnap.exists) {
        console.warn(`[mpWebhook] Pedido ${externalReference} não encontrado.`);
        res.json({ received: true });
        return;
      }

      const mapping = MP_PAYMENT_STATUS_MAP[status] ?? {
        orderStatus: 'pendente_pagamento',
        paymentStatus: 'pendente',
      };

      await orderRef.update({
        status: mapping.orderStatus,
        paymentStatus: mapping.paymentStatus,
        paymentId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(
        `[mpWebhook] Pedido ${externalReference} atualizado → ${mapping.orderStatus} / ${mapping.paymentStatus}`,
      );
    } catch (err) {
      console.error('[mpWebhook] Erro:', err);
      // Retornar 200 para o MercadoPago não reenviar indefinidamente
    }

    res.json({ received: true });
  },
);
