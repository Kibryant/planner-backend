import { z } from 'zod'

const AddressSchema = z.object({
  zip_code: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  line_1: z.string(),
})

const BillingAddressSchema = AddressSchema

const CardSchema = z.object({
  id: z.string(),
  last_four_digits: z.string(),
  brand: z.string(),
  holder_name: z.string(),
  exp_month: z.number(),
  exp_year: z.number(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  billing_address: BillingAddressSchema,
  type: z.string(),
})

const GatewayResponseSchema = z.object({
  code: z.string(),
})

const LastTransactionSchema = z.object({
  id: z.string(),
  transaction_type: z.string(),
  gateway_id: z.string(),
  amount: z.number(),
  status: z.string(),
  success: z.boolean(),
  installments: z.number(),
  acquirer_name: z.string(),
  acquirer_affiliation_code: z.string(),
  acquirer_tid: z.string(),
  acquirer_nsu: z.string(),
  acquirer_auth_code: z.string(),
  operation_type: z.string(),
  card: CardSchema,
  created_at: z.string(),
  updated_at: z.string(),
  gateway_response: GatewayResponseSchema,
})

const PhonesSchema = z.record(z.unknown()) // phones: {}

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  document: z.string(),
  type: z.string(),
  delinquent: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  phones: PhonesSchema,
})

const ChargeSchema = z.object({
  id: z.string(),
  code: z.string(),
  gateway_id: z.string(),
  amount: z.number(),
  status: z.string(),
  currency: z.string(),
  payment_method: z.string(),
  paid_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  customer: CustomerSchema,
  last_transaction: LastTransactionSchema,
})

const ItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  quantity: z.number(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

const ShippingSchema = z.object({
  amount: z.number(),
  description: z.string(),
  address: AddressSchema,
})

const DataSchema = z.object({
  id: z.string(),
  code: z.string(),
  amount: z.number(),
  currency: z.string(),
  closed: z.boolean(),
  items: z.array(ItemSchema),
  customer: CustomerSchema,
  shipping: ShippingSchema,
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string(),
  charges: z.array(ChargeSchema),
})

const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const bodyWebhookHotmart = z.object({
  id: z.string(),
  account: AccountSchema,
  type: z.string(),
  created_at: z.string(),
  data: DataSchema,
})
