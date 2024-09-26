import z from 'zod'

export const EnvSchema = z.object({
  JWT_SIGNING_KEY: z.string(),
})

export type Env = z.infer<typeof EnvSchema>

export const env = EnvSchema.parse(process.env)
