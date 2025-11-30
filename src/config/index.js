// src/config/index.js
const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_NAME: z.string().default('loyaltydb'),
  DB_USER: z.string().default('loyaltyuser'),
  DB_PASSWORD: z.string().default(''),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET minimal 8 karakter'),
  JWT_EXPIRES_IN: z.string().default('1h')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

const config = {
  env: env.NODE_ENV,
  port: Number(env.PORT),
  db: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  }
};

module.exports = { config };

