import type { Block } from 'payload'
import { link } from '@/fields/link'

export const ContentWithMedia: Block = {
  slug: 'contentWithMedia',
  interfaceName: 'ContentWithMedia',
  labels: {
    singular: 'Content with Media',
    plural: 'Content with Media',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
    },
    {
      type: 'textarea',
      name: 'description',
    },
    {
      type: 'upload',
      name: 'backgroundImage',
      relationTo: 'media',
    },
    link({
      appearances: false,
      disableLabel: true,
    }),
  ],
}
