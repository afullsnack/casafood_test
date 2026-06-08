import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import type { CurrenciesConfig, Currency } from '@payloadcms/plugin-ecommerce/types'

import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Ecommerce Template` : 'Payload Ecommerce Template'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

// Naira is the primary storefront currency (the Food Hub / Restaurant / Bulk Order
// pages price everything in ₦). USD is kept so the existing shop demo products that
// still carry `priceInUSD` continue to work. Naira is conventionally shown without
// kobo, so NGN uses 0 decimals — amounts are stored as whole naira.
const NGN: Currency = { code: 'NGN', decimals: 0, label: 'Nigerian Naira', symbol: '₦' }
const USD: Currency = { code: 'USD', decimals: 2, label: 'US Dollar', symbol: '$' }

const currencies: CurrenciesConfig = {
  defaultCurrency: 'NGN',
  supportedCurrencies: [NGN, USD],
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    currencies,
    customers: {
      slug: 'users',
    },
    carts: {
      cartsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'pageContext',
            type: 'select',
            options: ['food-hub', 'restaurant', 'bulk-order'],
            admin: { position: 'sidebar' },
            index: true,
          },
        ],
      }),
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'accessToken',
            type: 'text',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === 'create' || !value) {
                    return crypto.randomUUID()
                  }
                  return value
                },
              ],
            },
          },
        ],
      }),
    },
    payments: {
      paymentMethods: [
        stripeAdapter({
          secretKey: process.env.STRIPE_SECRET_KEY!,
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
    },
  }),
  // Media uploads must not touch the local filesystem in production: Vercel's
  // serverless filesystem is read-only (only /tmp is writable), so writing to
  // `public/media` throws and breaks uploads/seeding. When BLOB_READ_WRITE_TOKEN
  // is present (set automatically by a Vercel Blob store) uploads go to Vercel
  // Blob; without it the plugin disables itself and falls back to local disk for
  // local development.
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
    // Vercel Blob's `put` throws "blob already exists" when re-uploading the same
    // pathname unless `allowOverwrite` is passed (a v1+ breaking change in
    // @vercel/blob). The storage adapter never sets `allowOverwrite`, and seeding
    // clears DB rows via `payload.db.deleteMany` (which bypasses the cloud-storage
    // afterDelete hook), so old blobs like `media/hat-logo.png` linger and every
    // re-seed fails on the first media upload. `addRandomSuffix` (Vercel's
    // recommended option) gives each upload a unique pathname, eliminating the
    // conflict and keeping seeding idempotent.
    addRandomSuffix: true,
  }),
]
