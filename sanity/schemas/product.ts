import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      options: {
        list: [
          { title: 'USD', value: 'USD' },
          { title: 'EUR', value: 'EUR' },
          { title: 'GBP', value: 'GBP' },
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Physical', value: 'physical' },
          { title: 'Digital', value: 'digital' },
        ],
      },
      initialValue: 'physical',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      hidden: ({ document }) => document?.productType === 'digital',
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hasVariants',
      title: 'Has Variants',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'options',
      title: 'Product Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Option Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: { name: 'name', values: 'values' },
            prepare({ name, values }) {
              return {
                title: name,
                subtitle: values?.join(', '),
              }
            },
          },
        },
      ],
      hidden: ({ parent }) => !parent?.hasVariants,
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'productVariant',
          fields: [
            {
              name: 'name',
              title: 'Variant Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'sku',
              title: 'SKU',
              type: 'string',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule) => Rule.required().positive(),
            },
            {
              name: 'stock',
              title: 'Stock',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.min(0),
            },
            {
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'name',
                      title: 'Option Name',
                      type: 'string',
                    },
                    {
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { name: 'name', price: 'price', stock: 'stock' },
            prepare({ name, price, stock }) {
              return {
                title: name,
                subtitle: `$${price} - ${stock} in stock`,
              }
            },
          },
        },
      ],
      hidden: ({ parent }) => !parent?.hasVariants,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
      currency: 'currency',
    },
    prepare({ title, media, price, currency }) {
      return {
        title,
        media,
        subtitle: price ? `${currency || 'USD'} ${price}` : 'No price set',
      }
    },
  },
})
