import {defineField, defineType} from 'sanity'

export const offMarketProperty = defineType({
  name: 'offMarketProperty',
  title: 'Off-Market Property',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({
      name: 'stage',
      type: 'string',
      initialValue: 'pipeline',
      options: {list: ['pipeline', 'active', 'under_offer', 'closed']},
    }),
    defineField({
      name: 'assetClass',
      type: 'string',
      options: {list: ['Commercial Office', 'Industrial/Logistics', 'Residential', 'Mixed-Use', 'Land', 'Retail', 'Hospitality']},
    }),
    defineField({name: 'region', type: 'string', description: 'Public, e.g. "Nairobi, Kenya"'}),
    defineField({name: 'publicTeaser', type: 'text', rows: 3, description: 'Visible before NDA. No identifying detail.'}),
    defineField({name: 'confidentialLocation', type: 'string', description: 'Only released after NDA.'}),
    defineField({name: 'confidentialDetails', type: 'text', rows: 8, description: 'Only released after NDA.'}),
    defineField({name: 'askingPriceKes', type: 'number'}),
    defineField({name: 'askingPriceUsd', type: 'number'}),
    defineField({name: 'sellerType', type: 'string', options: {list: ['Developer', 'Family office', 'Institution', 'Distressed holder', 'Private owner']}}),
    defineField({
      name: 'accessLevel',
      type: 'string',
      initialValue: 'premium',
      options: {list: ['registered', 'verified', 'premium']},
    }),
    defineField({name: 'requiresNda', type: 'boolean', initialValue: true}),
    defineField({name: 'ndaTemplate', type: 'reference', to: [{type: 'ndaTemplate'}], hidden: ({parent}) => !parent?.requiresNda}),
    defineField({name: 'relatedBrief', type: 'reference', to: [{type: 'brief'}]}),
    defineField({name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString()}),
  ],
  preview: {select: {title: 'title', subtitle: 'stage'}},
})