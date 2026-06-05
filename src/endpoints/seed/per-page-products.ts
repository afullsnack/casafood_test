import type { Category, Product } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type SimpleProductArgs = {
  categories?: Category[]
  relatedProducts?: Product[]
}

export const freshProduceBoxData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Fresh Produce Box | Casa Food',
    description:
      'A handpicked selection of seasonal fresh produce — perfect for healthy meals all week.',
  },
  _status: 'published',
  page: 'food-hub',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'A handpicked selection of the freshest seasonal fruits and vegetables sourced from local farms. Each box is curated to bring you the best of what is in season, ensuring peak flavor and nutrition.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Fresh Produce Box',
  slug: 'fresh-produce-box',
  priceInUSDEnabled: true,
  priceInUSD: 3499,
  relatedProducts: relatedProducts,
})

export const mealKitChickenData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Chicken Meal Kit | Casa Food',
    description:
      'Everything you need to make a delicious chicken dinner — pre-portioned and ready to cook.',
  },
  _status: 'published',
  page: 'food-hub',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Pre-portioned chicken breast with fresh vegetables, herbs, and a signature Casa seasoning blend. Ready in under 30 minutes — just cook and enjoy.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Chicken Meal Kit',
  slug: 'meal-kit-chicken',
  priceInUSDEnabled: true,
  priceInUSD: 2499,
  relatedProducts: relatedProducts,
})

export const mealKitVeganData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Vegan Meal Kit | Casa Food',
    description:
      'A plant-powered meal kit with fresh vegetables, grains, and bold flavors.',
  },
  _status: 'published',
  page: 'food-hub',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'A colorful plant-based meal kit featuring seasonal vegetables, ancient grains, and a house-made dressing. Nutritious, satisfying, and completely vegan.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Vegan Meal Kit',
  slug: 'meal-kit-vegan',
  priceInUSDEnabled: true,
  priceInUSD: 2299,
  relatedProducts: relatedProducts,
})

export const jollofRiceBowlData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Jollof Rice Bowl | Casa Restaurant',
    description:
      'Our signature Jollof rice bowl with your choice of protein — a West African classic.',
  },
  _status: 'published',
  page: 'restaurant',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Fragrant Jollof rice slow-cooked in a rich tomato and pepper sauce, served with plantain, coleslaw, and your choice of protein. Our most popular dish.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Jollof Rice Bowl',
  slug: 'jollof-rice-bowl',
  priceInUSDEnabled: true,
  priceInUSD: 1499,
  relatedProducts: relatedProducts,
})

export const egusiSoupData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Egusi Soup & Pounded Yam | Casa Restaurant',
    description:
      'Rich melon seed soup served with smooth pounded yam — a classic comfort meal.',
  },
  _status: 'published',
  page: 'restaurant',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Ground melon seeds simmered with leafy greens, palm oil, and aromatic spices. Served with hand-pounded yam for a truly authentic West African dining experience.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Egusi Soup & Pounded Yam',
  slug: 'egusi-soup-pounded-yam',
  priceInUSDEnabled: true,
  priceInUSD: 1899,
  relatedProducts: relatedProducts,
})

export const suyaSkewersData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Suya Skewers | Casa Restaurant',
    description:
      'Grilled spiced beef skewers with a fiery peanut-pepper rub — a street food favorite.',
  },
  _status: 'published',
  page: 'restaurant',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Tender beef skewers coated in suya spice — a bold blend of peanut, ginger, and chili. Grilled to perfection and served with sliced onions, tomatoes, and a side of pepper sauce.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Suya Skewers',
  slug: 'suya-skewers',
  priceInUSDEnabled: true,
  priceInUSD: 1299,
  relatedProducts: relatedProducts,
})

export const bulkJollofRiceData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Bulk Jollof Rice (Serves 20) | Casa Bulk Order',
    description:
      'Our signature Jollof rice prepared in bulk — perfect for events, parties, and large gatherings.',
  },
  _status: 'published',
  page: 'bulk-order',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Our famous Jollof rice prepared in large quantities to serve up to 20 guests. Includes plantain, coleslaw, and your choice of protein. Perfect for birthdays, office parties, and celebrations.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Bulk Jollof Rice (Serves 20)',
  slug: 'bulk-jollof-rice',
  priceInUSDEnabled: true,
  priceInUSD: 8999,
  relatedProducts: relatedProducts,
})

export const bulkCateringPackageData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Full Catering Package (Serves 50) | Casa Bulk Order',
    description:
      'A complete catering package with a selection of Casa classics — feeds up to 50 guests.',
  },
  _status: 'published',
  page: 'bulk-order',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Our premium catering package featuring a curated selection of Casa classics: Jollof rice, fried rice, grilled chicken, beef suya, plantain, coleslaw, and a choice of two soups. Serves up to 50 guests and includes disposable serving ware.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Full Catering Package (Serves 50)',
  slug: 'bulk-catering-package',
  priceInUSDEnabled: true,
  priceInUSD: 24999,
  relatedProducts: relatedProducts,
})

export const partyPlatterData: (
  args: SimpleProductArgs,
) => RequiredDataFromCollectionSlug<'products'> = ({ categories, relatedProducts }) => ({
  meta: {
    title: 'Party Platter Bundle | Casa Bulk Order',
    description:
      'An assorted platter of Casa favorites — ideal for small parties, team lunches, and meetups.',
  },
  _status: 'published',
  page: 'bulk-order',
  layout: [],
  categories: categories,
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'An assorted party platter loaded with a mix of Casa favorites: suya skewers, spring rolls, chicken wings, plantain chips, and grilled corn. Serves 10–15 guests. Great for team lunches, small parties, and casual meetups.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  title: 'Party Platter Bundle',
  slug: 'party-platter-bundle',
  priceInUSDEnabled: true,
  priceInUSD: 14999,
  relatedProducts: relatedProducts,
})
