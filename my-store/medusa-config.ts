import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import {Modules} from '@medusajs/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
    plugins: [
    {
      resolve: '@medusajs/payment-stripe',
      options: {
        apiKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
  ],
  modules: {
    [Modules.PAYMENT]: {
      resolve: '@medusajs/payment',
      options: {
        providers: [
          {
            resolve: '@medusajs/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: process.env.STRIPE_SECRET_KEY,
            },
          },
        ],
      },
    },
  },
  // modules: [
  //   {
  //     resolve: '@medusajs/medusa/payment',
  //     options: {
  //       providers: [
  //         {
  //           resolve: '@medusajs/payment-stripe',
  //           id: 'stripe',
  //           options: {
  //             apiKey: process.env.STRIPE_SECRET_KEY,
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ],
})
