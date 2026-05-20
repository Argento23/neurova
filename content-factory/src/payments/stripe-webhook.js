import express from 'express';
import logger from '../logger.js';
import usersDb from '../db/users-db.js';

// ═══════════════════════════════════════════════════
// PAYPAL WEBHOOK HANDLER
// Processes subscription lifecycle events
// Docs: https://developer.paypal.com/docs/api/webhooks/
// ═══════════════════════════════════════════════════

const router = express.Router();

router.post('/webhook', express.json(), async (req, res) => {
  const event = req.body;

  if (!event || !event.event_type) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  logger.info(`PayPal event received: ${event.event_type}`, { id: event.id });

  try {
    // Log the event for audit trail
    await logPayPalEvent(event);

    switch (event.event_type) {
      // ─── NEW SUBSCRIPTION ACTIVATED ─────────
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.CREATED': {
        const sub = event.resource;
        const email = sub.subscriber?.email_address;
        const paypalSubId = sub.id;
        const planId = sub.plan_id;

        if (!email) {
          logger.warn('PayPal subscription: no email found');
          break;
        }

        let user = await usersDb.getUserByEmail(email);
        if (!user) {
          user = await usersDb.createUser({
            email,
            display_name: sub.subscriber?.name?.given_name || email.split('@')[0],
            plan: mapPlanIdToPlan(planId),
            plan_status: 'active',
            paypal_subscription_id: paypalSubId
          });
        } else {
          await usersDb.activateSubscription(user.id, {
            plan: mapPlanIdToPlan(planId),
            stripeCustomerId: null, // not using Stripe
            stripeSubscriptionId: paypalSubId // reuse field for PayPal sub ID
          });
        }

        logger.info(`✅ New PayPal subscriber: ${email} → ${mapPlanIdToPlan(planId)}`);
        break;
      }

      // ─── PAYMENT COMPLETED (renewal) ────────
      case 'PAYMENT.SALE.COMPLETED': {
        const sale = event.resource;
        const paypalSubId = sale.billing_agreement_id;
        
        if (paypalSubId) {
          const user = await usersDb.getUserByPayPalSubscription(paypalSubId);
          if (user) {
            await usersDb.updateUser(user.id, { plan_status: 'active' });
            logger.info(`🔄 Subscription renewed: ${user.email}`);
          }
        }
        break;
      }

      // ─── PAYMENT FAILED ───────────────────
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        const sub = event.resource;
        const user = await usersDb.getUserByPayPalSubscription(sub.id);
        if (user) {
          await usersDb.updateUser(user.id, { plan_status: 'past_due' });
          logger.warn(`⚠️ PayPal payment failed: ${user.email}`);
        }
        break;
      }

      // ─── SUBSCRIPTION CANCELLED ───────────
      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        const sub = event.resource;
        await usersDb.cancelSubscription(sub.id);
        logger.info(`❌ Subscription cancelled: ${sub.id}`);
        break;
      }

      // ─── ONE-TIME PAYMENT (lead purchase) ──
      case 'CHECKOUT.ORDER.APPROVED': {
        const order = event.resource;
        const leadId = order.purchase_units?.[0]?.custom_id; // We set lead_id as custom_id
        const buyerEmail = order.payer?.email_address;

        if (leadId && buyerEmail) {
          const { createClient } = await import('@supabase/supabase-js');
          const { default: cfg } = await import('../config.js');
          const db = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);

          const buyer = await usersDb.getUserByEmail(buyerEmail);
          if (buyer) {
            await db.from('lead_marketplace')
              .update({
                status: 'sold',
                purchased_by: buyer.id,
                purchased_at: new Date().toISOString(),
                paypal_order_id: order.id
              })
              .eq('lead_id', leadId);

            logger.info(`🛒 Lead purchased via PayPal: ${leadId} by ${buyerEmail}`);
          }
        }
        break;
      }

      default:
        logger.info(`PayPal event unhandled: ${event.event_type}`);
    }

    res.json({ received: true });

  } catch (error) {
    logger.error('PayPal webhook processing error', {
      event: event.event_type,
      error: error.message
    });
    res.status(200).json({ received: true, error: error.message });
  }
});

/**
 * Map PayPal Plan ID to internal plan name
 * You'll set these IDs when creating plans in PayPal Dashboard
 */
function mapPlanIdToPlan(planId) {
  const planMap = {
    [process.env.PAYPAL_PLAN_STARTER]: 'starter',
    [process.env.PAYPAL_PLAN_PRO]: 'pro',
    [process.env.PAYPAL_PLAN_ENTERPRISE]: 'enterprise'
  };
  return planMap[planId] || 'starter';
}

/**
 * Log PayPal event for audit
 */
async function logPayPalEvent(event) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const { default: cfg } = await import('../config.js');
    const db = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);

    await db.from('payment_events').insert({
      provider: 'paypal',
      event_id: event.id,
      event_type: event.event_type,
      customer_email: event.resource?.subscriber?.email_address || event.resource?.payer?.email_address,
      subscription_id: event.resource?.id || event.resource?.billing_agreement_id,
      amount: parseFloat(event.resource?.amount?.total || event.resource?.purchase_units?.[0]?.amount?.value || 0),
      currency: event.resource?.amount?.currency || event.resource?.purchase_units?.[0]?.amount?.currency_code || 'USD',
      payload: event,
      processed: true
    });
  } catch (err) {
    logger.error('Failed to log PayPal event', { error: err.message });
  }
}

export default router;
