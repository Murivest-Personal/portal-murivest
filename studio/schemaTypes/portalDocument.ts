import {defineField, defineType} from 'sanity'

export const portalDocument = defineType({
  name: 'portalDocument',
  title: 'Portal Document',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'kind',
      type: 'string',
      options: {list: [
        {title: 'Investment memorandum', value: 'memorandum'},
        {title: 'Financial model', value: 'financial_model'},
        {title: 'Legal / title', value: 'legal'},
        {title: 'Survey / technical', value: 'technical'},
        {title: 'Market report', value: 'report'},
        {title: 'Other', value: 'other'},
      ]},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'file',
      type: 'file',
      options: {accept: '.pdf,.xlsx,.docx'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'version', type: 'string'}),
    defineField({name: 'relatedBrief', type: 'reference', to: [{type: 'brief'}]}),
    defineField({name: 'relatedProperty', type: 'reference', to: [{type: 'offMarketProperty'}]}),
    defineField({name: 'accessLevel', type: 'string', initialValue: 'verified', options: {list: ['registered', 'verified', 'premium']}}),
    defineField({name: 'requiresNda', type: 'boolean', initialValue: true}),
    defineField({name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString()}),
  ],
  preview: {select: {title: 'title', subtitle: 'kind'}},
})