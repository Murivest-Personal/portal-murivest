import {defineArrayMember, defineField, defineType} from 'sanity'

export const dealRoomSettings = defineType({
  name: 'dealRoomSettings',
  title: 'Deal Room Settings',
  type: 'document',
  fields: [
    defineField({name: 'dealFlowHeading', type: 'string', initialValue: 'The Off-Market Advantage'}),
    defineField({name: 'dealFlowIntro', type: 'text', rows: 3}),
    defineField({
      name: 'dealFlowInsights',
      type: 'array',
      description: 'Only publish statistics you can source. Every item needs a source.',
      validation: (r) => r.max(4),
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'stat', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'description', type: 'text', rows: 3}),
        defineField({name: 'source', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'sourceUrl', type: 'url'}),
      ]})],
    }),
  ],
  preview: {prepare: () => ({title: 'Deal Room Settings'})},
})