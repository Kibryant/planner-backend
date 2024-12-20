export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  UPDATED: 205,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

export const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
] as const

export const DAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const

export interface DataWebhookHotmart {
  id: string
  creation_date: number
  event: string
  version: string
  data: {
    product: {
      id: number
      ucode: string
      name: string
      has_co_production: boolean
    }
    affiliates: {
      affiliate_code: string
      name: string
    }[]
    buyer: {
      email: string
      name: string
      checkout_phone: string
      address: {
        country: string
        country_iso: string
      }
    }
    producer: {
      name: string
    }
    commissions: {
      value: number
      source: string
      currency_value: string
    }[]
    purchase: {
      approved_date: number
      full_price: {
        value: number
        currency_value: string
      }
      price: {
        value: number
        currency_value: string
      }
      checkout_country: {
        name: string
        iso: string
      }
      order_bump: {
        is_order_bump: boolean
        parent_purchase_transaction: string
      }
      original_offer_price: {
        value: number
        currency_value: string
      }
      order_date: number
      status: string
      transaction: string
      payment: {
        installments_number: number
        type: string
      }
      offer: {
        code: string
      }
      sckPaymentLink: string
    }
    subscription: {
      status: string
      plan: {
        id: number
        name: string
      }
      subscriber: {
        code: string
      }
    }
  }
}
