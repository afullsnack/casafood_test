import type { Field } from 'payload'

export const MyDateField: Field = {
  name: 'publishedDate', // required
  type: 'date',
  admin: {
    date: {
      pickerAppearance: 'dayAndTime', // 'dayOnly' (default) or 'dayAndTime'
      displayFormat: 'MMMM dd, yyyy', // uses date-fns format strings
    },
  },
}
