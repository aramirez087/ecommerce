import { defineField, defineType } from 'sanity'

const userAddress = defineType({
  name: 'userAddress',
  title: 'User Address',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'Address ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
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
    defineField({
      name: 'isDefault',
      title: 'Default Address',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

export const user = defineType({
  name: 'user',
  title: 'Users',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hashedPassword',
      title: 'Hashed Password',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'image',
      title: 'Profile Image URL',
      type: 'url',
    }),
    defineField({
      name: 'provider',
      title: 'Auth Provider',
      type: 'string',
      options: {
        list: [
          { title: 'Credentials', value: 'credentials' },
          { title: 'Google', value: 'google' },
          { title: 'GitHub', value: 'github' },
        ],
      },
      initialValue: 'credentials',
    }),
    defineField({
      name: 'addresses',
      title: 'Saved Addresses',
      type: 'array',
      of: [{ type: 'userAddress' }],
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
      name: 'name',
      email: 'email',
    },
    prepare({ name, email }) {
      return {
        title: name || 'Unnamed User',
        subtitle: email,
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
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})

export { userAddress }
