import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'showSearch',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show search bar',
    },
    {
      name: 'showCart',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show cart button',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      minRows: 4,
    },
  ],
}
