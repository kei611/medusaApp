import { loadEnv, defineConfig } from "@medusajs/framework/utils";
// import { Modules } from '@medusajs/utils'
import { Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

console.log("S3 BASE URL:", process.env.S3_BASE_URL);
console.log("Driver:", process.env.FILESYSTEM_DRIVER);

export const admin = {
  path: process.env.MEDUSA_ADMIN_PATH || "/app",
  backend_url: process.env.MEDUSA_BACKEND_URL || "https://null-acception.com",
  disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
};

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  plugins: [
    {
      resolve: "@medusajs/payment-stripe",
      options: {
        apiKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
  ],

  modules: {
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_SECRET_KEY,
            },
          },
        ],
      },
    },

    [Modules.FILE]: {
      resolve: "@medusajs/medusa/file",
      options: {
        default_provider: "s3",
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              region: "ap-northeast-1",
              bucket: "medusa-store-assets-images",
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              file_url: process.env.S3_BASE_URL,
            },
          },
        ],
      },
    },

    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/notification",
      options: {
        provider: {
          resolve: "@medusajs/notification-sendgrid", // or smtp if using SMTP
          options: {
            api_key: process.env.SENDGRID_API_KEY, // or SMTP config
            from: "kei39maroond@yahoo.co.jp",
          },
        },
      },
    },

    [Modules.AUTH]: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {
              hashConfig: {
                logN: 15,
                r: 8,
                p: 1,
              },
            },
          },
        ],
      },
    },

  },
});
