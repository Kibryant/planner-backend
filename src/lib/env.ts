import z from 'zod'

export const EnvSchema = z.object({
  JWT_SIGNING_KEY: z.string(),
  ADMIN_ACCESS_CODE: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  SECRET_PASSWORD: z.string(),
  WEBHOOK_HOTTOK_HOTMART: z.string(),
  WEBHOOK_HOTTOK_HOTMART_LATAM: z.string(),
})

export type Env = z.infer<typeof EnvSchema>

export const env = EnvSchema.parse(process.env)
