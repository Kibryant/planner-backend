import z from 'zod'

export const EnvSchema = z.object({
  JWT_SIGNING_KEY: z.string(),
  DATABASE_URL: z.string(),
  ADMIN_ACCESS_CODE: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  SECRET_PASSWORD: z.string(),
})

export type Env = z.infer<typeof EnvSchema>

export const env = EnvSchema.parse(process.env)
