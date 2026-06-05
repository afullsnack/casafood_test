import { RequiredDataFromCollectionSlug } from 'payload'

export const cateringFormData: () => RequiredDataFromCollectionSlug<'forms'> = () => {
  return {
    confirmationMessage: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Your catering inquiry has been submitted successfully.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    confirmationType: 'message',
    emails: [
      {
        emailFrom: '"Casa" <demo@casafood.com>',
        emailTo: '{{email}}',
        message: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Thank you for your catering inquiry. We will review your request and get back to you with a proposal within 24-48 hours.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        subject: 'Catering Inquiry Received',
      },
    ],
    fields: [
      {
        name: 'full-name',
        blockName: 'full-name',
        blockType: 'text',
        label: 'Full Name',
        required: true,
        width: 100,
      },
      {
        name: 'email',
        blockName: 'email',
        blockType: 'email',
        label: 'Email',
        required: true,
        width: 100,
      },
      {
        name: 'phone',
        blockName: 'phone',
        blockType: 'number',
        label: 'Phone',
        required: true,
        width: 100,
      },
      {
        name: 'service-type',
        blockName: 'service-type',
        blockType: 'select',
        label: 'Service Type',
        required: true,
        width: 100,
        options: [
          { label: 'Indoor Catering', value: 'indoor-catering' },
          { label: 'Outdoor Catering', value: 'outdoor-catering' },
          { label: 'Bulk Cooking', value: 'bulk-cooking' },
          { label: 'Private Chef Services', value: 'private-chef' },
        ],
      },
      {
        name: 'event-date',
        blockName: 'event-date',
        blockType: 'text',
        label: 'Event Date',
        required: true,
        width: 100,
      },
      {
        name: 'guest-count',
        blockName: 'guest-count',
        blockType: 'number',
        label: 'Number of Guests',
        required: true,
        width: 100,
      },
      {
        name: 'event-location',
        blockName: 'event-location',
        blockType: 'text',
        label: 'Event Location',
        required: true,
        width: 100,
      },
      {
        name: 'additional-details',
        blockName: 'additional-details',
        blockType: 'textarea',
        label: 'Additional Details',
        required: false,
        width: 100,
      },
    ],
    submitButtonLabel: 'Submit Inquiry',
    title: 'Catering Inquiry',
  }
}
