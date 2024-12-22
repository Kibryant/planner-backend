import { z } from 'zod'

export const bodyWebhookHotmart = z.object({
  id: z.string(),
  creation_date: z.number(),
  event: z.string(),
  version: z.string(),
  data: z.object({
    product: z.object({
      id: z.number(),
      ucode: z.string(),
      name: z.string(),
      has_co_production: z.boolean(),
    }),
    affiliates: z.array(
      z.object({
        affiliate_code: z.string(),
        name: z.string(),
      })
    ),
    buyer: z.object({
      email: z.string(),
      name: z.string(),
      checkout_phone: z.string(),
      address: z.object({
        country: z.string(),
        country_iso: z.string(),
      }),
    }),
    producer: z.object({
      name: z.string(),
    }),
    commissions: z.array(
      z.object({
        value: z.number(),
        source: z.string(),
        currency_value: z.string(),
      })
    ),
    purchase: z.object({
      approved_date: z.number(),
      full_price: z.object({
        value: z.number(),
        currency_value: z.string(),
      }),
      price: z.object({
        value: z.number(),
        currency_value: z.string(),
      }),
      checkout_country: z.object({
        name: z.string(),
        iso: z.string(),
      }),
      order_bump: z.object({
        is_order_bump: z.boolean(),
        parent_purchase_transaction: z.string(),
      }),
      original_offer_price: z.object({
        value: z.number(),
        currency_value: z.string(),
      }),
      order_date: z.number(),
      status: z.string(),
      transaction: z.string(),
      payment: z.object({
        installments_number: z.number(),
        type: z.string(),
      }),
      offer: z.object({
        code: z.string(),
      }),
      sckPaymentLink: z.string(),
    }),
    subscription: z.object({
      status: z.string(),
      plan: z.object({
        id: z.number(),
        name: z.string(),
      }),
      subscriber: z.object({
        code: z.string(),
      }),
    }),
  }),
})

export type BodyWebhookHotmart = z.infer<typeof bodyWebhookHotmart>
