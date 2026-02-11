import { defineField, defineType } from 'sanity'

const orderItem = defineType({
  name: 'orderItem',
  title: 'Order Item',
  type: 'object',
  fields: [
    defineField({
      name: 'productId',
      title: 'Product ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Product Image URL',
      type: 'string',
    }),
  ],
})

const shippingAddress = defineType({
  name: 'shippingAddress',
  title: 'Shipping Address',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'line1',
      title: 'Address Line 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'line2',
      title: 'Address Line 2',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State / Province',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})

export const order = defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [{ type: 'orderItem' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'tax',
      title: 'Tax',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'shippingAddress',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Reference to the user who placed this order (optional for guest checkout)',
    }),
    defineField({
      name: 'tilopayOrderId',
      title: 'Tilopay Order ID',
      type: 'string',
      description: "Tilopay's transaction reference",
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      status: 'status',
      total: 'total',
      customerEmail: 'customerEmail',
    },
    prepare({ orderNumber, status, total, customerEmail }) {
      return {
        title: `Order #${orderNumber}`,
        subtitle: `${status} - $${total?.toFixed(2)} - ${customerEmail}`,
      }
    },
  },
  orderings: [
    {
      title: 'Created Date, New',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Order Number',
      name: 'orderNumberAsc',
      by: [{ field: 'orderNumber', direction: 'asc' }],
    },
  ],
})

export { orderItem, shippingAddress }
